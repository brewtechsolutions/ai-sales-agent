import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { google, calendar_v3 } from 'googleapis';
import { OAuth2Client } from 'google-auth-library';
import * as moment from 'moment-timezone';

@Injectable()
export class GoogleCalendarService {
  private readonly logger = new Logger(GoogleCalendarService.name);
  private readonly oauth2Client: OAuth2Client;
  private readonly calendar: calendar_v3.Calendar;
  private readonly malaysiaTimezone = 'Asia/Kuala_Lumpur';

  constructor(private configService: ConfigService) {
    this.oauth2Client = new OAuth2Client(
      this.configService.get<string>('google.clientId'),
      this.configService.get<string>('google.clientSecret'),
      this.configService.get<string>('google.redirectUri'),
    );

    this.calendar = google.calendar({ version: 'v3', auth: this.oauth2Client });
  }

  /**
   * Get available time slots for a specific date range
   */
  async getAvailableSlots(
    startDate: Date,
    endDate: Date,
    calendarId: string = 'primary',
    durationMinutes: number = 60,
  ): Promise<TimeSlot[]> {
    try {
      const startTime = moment(startDate).tz(this.malaysiaTimezone).format();
      const endTime = moment(endDate).tz(this.malaysiaTimezone).format();

      const response = await this.calendar.events.list({
        calendarId,
        timeMin: startTime,
        timeMax: endTime,
        singleEvents: true,
        orderBy: 'startTime',
      });

      const events = response.data.items || [];
      const busySlots = this.parseBusySlots(events);
      const availableSlots = this.generateAvailableSlots(
        startDate,
        endDate,
        busySlots,
        durationMinutes,
      );

      this.logger.debug(`Found ${availableSlots.length} available slots`);
      return availableSlots;
    } catch (error) {
      this.logger.error('Error getting available slots:', error);
      throw new Error('Failed to get available time slots');
    }
  }

  /**
   * Create a calendar event
   */
  async createEvent(
    title: string,
    description: string,
    startTime: Date,
    endTime: Date,
    attendeeEmail?: string,
    calendarId: string = 'primary',
  ): Promise<calendar_v3.Schema$Event> {
    try {
      const event = {
        summary: title,
        description,
        start: {
          dateTime: moment(startTime).tz(this.malaysiaTimezone).format(),
          timeZone: this.malaysiaTimezone,
        },
        end: {
          dateTime: moment(endTime).tz(this.malaysiaTimezone).format(),
          timeZone: this.malaysiaTimezone,
        },
        attendees: attendeeEmail ? [{ email: attendeeEmail }] : [],
        reminders: {
          useDefault: false,
          overrides: [
            { method: 'email', minutes: 24 * 60 }, // 1 day before
            { method: 'popup', minutes: 60 }, // 1 hour before
          ],
        },
      };

      const response = await this.calendar.events.insert({
        calendarId,
        requestBody: event,
      });

      this.logger.log(`Created calendar event: ${response.data.id}`);
      return response.data;
    } catch (error) {
      this.logger.error('Error creating calendar event:', error);
      throw new Error('Failed to create calendar event');
    }
  }

  /**
   * Update a calendar event
   */
  async updateEvent(
    eventId: string,
    updates: Partial<calendar_v3.Schema$Event>,
    calendarId: string = 'primary',
  ): Promise<calendar_v3.Schema$Event> {
    try {
      const response = await this.calendar.events.update({
        calendarId,
        eventId,
        requestBody: updates,
      });

      this.logger.log(`Updated calendar event: ${eventId}`);
      return response.data;
    } catch (error) {
      this.logger.error('Error updating calendar event:', error);
      throw new Error('Failed to update calendar event');
    }
  }

  /**
   * Delete a calendar event
   */
  async deleteEvent(eventId: string, calendarId: string = 'primary'): Promise<void> {
    try {
      await this.calendar.events.delete({
        calendarId,
        eventId,
      });

      this.logger.log(`Deleted calendar event: ${eventId}`);
    } catch (error) {
      this.logger.error('Error deleting calendar event:', error);
      throw new Error('Failed to delete calendar event');
    }
  }

  /**
   * Get events for a specific date range
   */
  async getEvents(
    startDate: Date,
    endDate: Date,
    calendarId: string = 'primary',
  ): Promise<calendar_v3.Schema$Event[]> {
    try {
      const startTime = moment(startDate).tz(this.malaysiaTimezone).format();
      const endTime = moment(endDate).tz(this.malaysiaTimezone).format();

      const response = await this.calendar.events.list({
        calendarId,
        timeMin: startTime,
        timeMax: endTime,
        singleEvents: true,
        orderBy: 'startTime',
      });

      return response.data.items || [];
    } catch (error) {
      this.logger.error('Error getting events:', error);
      throw new Error('Failed to get calendar events');
    }
  }

  /**
   * Check if a specific time slot is available
   */
  async isTimeSlotAvailable(
    startTime: Date,
    endTime: Date,
    calendarId: string = 'primary',
  ): Promise<boolean> {
    try {
      const events = await this.getEvents(startTime, endTime, calendarId);
      
      for (const event of events) {
        const eventStart = moment(event.start?.dateTime || event.start?.date);
        const eventEnd = moment(event.end?.dateTime || event.end?.date);
        const slotStart = moment(startTime);
        const slotEnd = moment(endTime);

        // Check for overlap
        if (slotStart.isBefore(eventEnd) && slotEnd.isAfter(eventStart)) {
          return false;
        }
      }

      return true;
    } catch (error) {
      this.logger.error('Error checking time slot availability:', error);
      return false;
    }
  }

  /**
   * Get Malaysian business hours for a specific date
   */
  getBusinessHours(date: Date): { start: Date; end: Date } {
    const malaysiaDate = moment(date).tz(this.malaysiaTimezone);
    
    // Business hours: 9 AM - 6 PM, Monday to Friday
    const start = malaysiaDate.clone().hour(9).minute(0).second(0).millisecond(0).toDate();
    const end = malaysiaDate.clone().hour(18).minute(0).second(0).millisecond(0).toDate();
    
    return { start, end };
  }

  /**
   * Check if a date is within Malaysian business hours
   */
  isWithinBusinessHours(date: Date): boolean {
    const malaysiaDate = moment(date).tz(this.malaysiaTimezone);
    const dayOfWeek = malaysiaDate.day(); // 0 = Sunday, 6 = Saturday
    const hour = malaysiaDate.hour();
    
    // Business days: Monday (1) to Friday (5)
    // Business hours: 9 AM to 6 PM
    return dayOfWeek >= 1 && dayOfWeek <= 5 && hour >= 9 && hour < 18;
  }

  /**
   * Get next available business day
   */
  getNextBusinessDay(date: Date): Date {
    let nextDay = moment(date).tz(this.malaysiaTimezone).add(1, 'day');
    
    // Skip weekends
    while (nextDay.day() === 0 || nextDay.day() === 6) {
      nextDay.add(1, 'day');
    }
    
    return nextDay.toDate();
  }

  private parseBusySlots(events: calendar_v3.Schema$Event[]): TimeSlot[] {
    return events.map(event => ({
      start: new Date(event.start?.dateTime || event.start?.date || ''),
      end: new Date(event.end?.dateTime || event.end?.date || ''),
      title: event.summary || 'Busy',
      description: event.description || '',
    }));
  }

  private generateAvailableSlots(
    startDate: Date,
    endDate: Date,
    busySlots: TimeSlot[],
    durationMinutes: number,
  ): TimeSlot[] {
    const availableSlots: TimeSlot[] = [];
    const start = moment(startDate).tz(this.malaysiaTimezone);
    const end = moment(endDate).tz(this.malaysiaTimezone);
    
    // Generate slots for each day
    let current = start.clone();
    while (current.isBefore(end)) {
      // Skip weekends
      if (current.day() !== 0 && current.day() !== 6) {
        const daySlots = this.generateDaySlots(current.toDate(), busySlots, durationMinutes);
        availableSlots.push(...daySlots);
      }
      current.add(1, 'day');
    }
    
    return availableSlots;
  }

  private generateDaySlots(
    date: Date,
    busySlots: TimeSlot[],
    durationMinutes: number,
  ): TimeSlot[] {
    const slots: TimeSlot[] = [];
    const dayStart = moment(date).tz(this.malaysiaTimezone).hour(9).minute(0);
    const dayEnd = moment(date).tz(this.malaysiaTimezone).hour(18).minute(0);
    
    let current = dayStart.clone();
    while (current.clone().add(durationMinutes, 'minutes').isBeforeOrSame(dayEnd)) {
      const slotStart = current.toDate();
      const slotEnd = current.clone().add(durationMinutes, 'minutes').toDate();
      
      // Check if this slot conflicts with busy slots
      const isAvailable = !this.hasConflict(slotStart, slotEnd, busySlots);
      
      if (isAvailable) {
        slots.push({
          start: slotStart,
          end: slotEnd,
          title: 'Available',
          description: `${durationMinutes}-minute slot available`,
        });
      }
      
      current.add(30, 'minutes'); // Check every 30 minutes
    }
    
    return slots;
  }

  private hasConflict(slotStart: Date, slotEnd: Date, busySlots: TimeSlot[]): boolean {
    return busySlots.some(busySlot => {
      const busyStart = moment(busySlot.start);
      const busyEnd = moment(busySlot.end);
      const slotStartMoment = moment(slotStart);
      const slotEndMoment = moment(slotEnd);
      
      return slotStartMoment.isBefore(busyEnd) && slotEndMoment.isAfter(busyStart);
    });
  }
}

export interface TimeSlot {
  start: Date;
  end: Date;
  title: string;
  description: string;
}
