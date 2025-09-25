import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { CacheService } from '../../common/cache/cache.service';
import { GoogleCalendarService, TimeSlot } from './google-calendar.service';
import * as moment from 'moment-timezone';

@Injectable()
export class CalendarService {
  private readonly logger = new Logger(CalendarService.name);
  private readonly malaysiaTimezone = 'Asia/Kuala_Lumpur';

  constructor(
    private prisma: PrismaService,
    private cacheService: CacheService,
    private googleCalendarService: GoogleCalendarService,
  ) {}

  /**
   * Get available consultation slots
   */
  async getAvailableConsultationSlots(
    startDate: Date,
    endDate: Date,
    expertId?: string,
    durationMinutes: number = 60,
  ): Promise<TimeSlot[]> {
    try {
      const cacheKey = `consultation_slots_${expertId || 'default'}_${startDate.toISOString()}_${endDate.toISOString()}`;
      
      // Try to get from cache first
      const cached = await this.cacheService.get<TimeSlot[]>(cacheKey);
      if (cached) {
        return cached;
      }

      // Get available slots from Google Calendar
      const availableSlots = await this.googleCalendarService.getAvailableSlots(
        startDate,
        endDate,
        'primary', // Use primary calendar for now
        durationMinutes,
      );

      // Filter out slots that are already booked for consultations
      const bookedConsultations = await this.getBookedConsultations(startDate, endDate, expertId);
      const freeSlots = this.filterOutBookedSlots(availableSlots, bookedConsultations);

      // Cache the result for 5 minutes
      await this.cacheService.set(cacheKey, freeSlots, 300);

      this.logger.debug(`Found ${freeSlots.length} available consultation slots`);
      return freeSlots;
    } catch (error) {
      this.logger.error('Error getting available consultation slots:', error);
      throw new Error('Failed to get available consultation slots');
    }
  }

  /**
   * Book a consultation slot
   */
  async bookConsultationSlot(
    customerId: string,
    expertName: string,
    expertEmail: string,
    startTime: Date,
    endTime: Date,
    productId?: string,
    notes?: string,
  ): Promise<any> {
    try {
      // Check if slot is still available
      const isAvailable = await this.googleCalendarService.isTimeSlotAvailable(
        startTime,
        endTime,
      );

      if (!isAvailable) {
        throw new Error('Time slot is no longer available');
      }

      // Create calendar event
      const event = await this.googleCalendarService.createEvent(
        `Consultation with ${expertName}`,
        `Customer consultation session${notes ? `\n\nNotes: ${notes}` : ''}`,
        startTime,
        endTime,
        expertEmail,
      );

      // Save consultation to database
      const consultation = await this.prisma.consultation.create({
        data: {
          customerId,
          productId,
          expertName,
          expertEmail,
          scheduledAt: startTime,
          duration: Math.round((endTime.getTime() - startTime.getTime()) / (1000 * 60)),
          status: 'SCHEDULED',
          meetingLink: event.hangoutLink || '',
          notes,
        },
      });

      // Clear cache
      await this.clearConsultationCache();

      this.logger.log(`Booked consultation: ${consultation.id}`);
      return consultation;
    } catch (error) {
      this.logger.error('Error booking consultation slot:', error);
      throw error;
    }
  }

  /**
   * Update consultation
   */
  async updateConsultation(
    consultationId: string,
    updates: {
      startTime?: Date;
      endTime?: Date;
      status?: string;
      notes?: string;
    },
  ): Promise<any> {
    try {
      const consultation = await this.prisma.consultation.findUnique({
        where: { id: consultationId },
      });

      if (!consultation) {
        throw new Error('Consultation not found');
      }

      // Update calendar event if time changed
      if (updates.startTime && updates.endTime) {
        const newStartTime = updates.startTime;
        const newEndTime = updates.endTime;
        
        // Update Google Calendar event
        await this.googleCalendarService.updateEvent(
          consultation.id, // Assuming we store Google Calendar event ID
          {
            start: {
              dateTime: moment(newStartTime).tz(this.malaysiaTimezone).format(),
              timeZone: this.malaysiaTimezone,
            },
            end: {
              dateTime: moment(newEndTime).tz(this.malaysiaTimezone).format(),
              timeZone: this.malaysiaTimezone,
            },
          },
        );
      }

      // Update database
      const updatedConsultation = await this.prisma.consultation.update({
        where: { id: consultationId },
        data: {
          scheduledAt: updates.startTime || consultation.scheduledAt,
          duration: updates.startTime && updates.endTime 
            ? Math.round((updates.endTime.getTime() - updates.startTime.getTime()) / (1000 * 60))
            : consultation.duration,
          status: updates.status as any || consultation.status,
          notes: updates.notes || consultation.notes,
        },
      });

      // Clear cache
      await this.clearConsultationCache();

      this.logger.log(`Updated consultation: ${consultationId}`);
      return updatedConsultation;
    } catch (error) {
      this.logger.error('Error updating consultation:', error);
      throw error;
    }
  }

  /**
   * Cancel consultation
   */
  async cancelConsultation(consultationId: string): Promise<void> {
    try {
      const consultation = await this.prisma.consultation.findUnique({
        where: { id: consultationId },
      });

      if (!consultation) {
        throw new Error('Consultation not found');
      }

      // Delete from Google Calendar
      await this.googleCalendarService.deleteEvent(consultation.id);

      // Update database
      await this.prisma.consultation.update({
        where: { id: consultationId },
        data: { status: 'CANCELLED' },
      });

      // Clear cache
      await this.clearConsultationCache();

      this.logger.log(`Cancelled consultation: ${consultationId}`);
    } catch (error) {
      this.logger.error('Error cancelling consultation:', error);
      throw error;
    }
  }

  /**
   * Get customer's consultations
   */
  async getCustomerConsultations(customerId: string): Promise<any[]> {
    try {
      return await this.prisma.consultation.findMany({
        where: { customerId },
        include: {
          product: true,
        },
        orderBy: { scheduledAt: 'desc' },
      });
    } catch (error) {
      this.logger.error('Error getting customer consultations:', error);
      throw new Error('Failed to get customer consultations');
    }
  }

  /**
   * Get consultation by ID
   */
  async getConsultation(consultationId: string): Promise<any> {
    try {
      return await this.prisma.consultation.findUnique({
        where: { id: consultationId },
        include: {
          customer: true,
          product: true,
        },
      });
    } catch (error) {
      this.logger.error('Error getting consultation:', error);
      throw new Error('Failed to get consultation');
    }
  }

  /**
   * Get upcoming consultations
   */
  async getUpcomingConsultations(days: number = 7): Promise<any[]> {
    try {
      const startDate = new Date();
      const endDate = new Date();
      endDate.setDate(endDate.getDate() + days);

      return await this.prisma.consultation.findMany({
        where: {
          scheduledAt: {
            gte: startDate,
            lte: endDate,
          },
          status: {
            in: ['SCHEDULED', 'CONFIRMED'],
          },
        },
        include: {
          customer: true,
          product: true,
        },
        orderBy: { scheduledAt: 'asc' },
      });
    } catch (error) {
      this.logger.error('Error getting upcoming consultations:', error);
      throw new Error('Failed to get upcoming consultations');
    }
  }

  /**
   * Check if time slot is available for consultation
   */
  async isConsultationSlotAvailable(
    startTime: Date,
    endTime: Date,
    expertId?: string,
  ): Promise<boolean> {
    try {
      // Check Google Calendar availability
      const isCalendarAvailable = await this.googleCalendarService.isTimeSlotAvailable(
        startTime,
        endTime,
      );

      if (!isCalendarAvailable) {
        return false;
      }

      // Check database for conflicting consultations
      const conflictingConsultation = await this.prisma.consultation.findFirst({
        where: {
          scheduledAt: {
            gte: startTime,
            lt: endTime,
          },
          status: {
            in: ['SCHEDULED', 'CONFIRMED'],
          },
        },
      });

      return !conflictingConsultation;
    } catch (error) {
      this.logger.error('Error checking consultation slot availability:', error);
      return false;
    }
  }

  private async getBookedConsultations(
    startDate: Date,
    endDate: Date,
    expertId?: string,
  ): Promise<any[]> {
    return await this.prisma.consultation.findMany({
      where: {
        scheduledAt: {
          gte: startDate,
          lte: endDate,
        },
        status: {
          in: ['SCHEDULED', 'CONFIRMED'],
        },
        ...(expertId && { expertName: expertId }),
      },
    });
  }

  private filterOutBookedSlots(availableSlots: TimeSlot[], bookedConsultations: any[]): TimeSlot[] {
    return availableSlots.filter(slot => {
      return !bookedConsultations.some(consultation => {
        const consultationStart = new Date(consultation.scheduledAt);
        const consultationEnd = new Date(consultationStart.getTime() + consultation.duration * 60 * 1000);
        
        return (
          slot.start < consultationEnd &&
          slot.end > consultationStart
        );
      });
    });
  }

  private async clearConsultationCache(): Promise<void> {
    try {
      const keys = await this.cacheService.keys('consultation_slots_*');
      for (const key of keys) {
        await this.cacheService.del(key);
      }
    } catch (error) {
      this.logger.error('Error clearing consultation cache:', error);
    }
  }
}
