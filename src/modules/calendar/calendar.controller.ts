import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { CalendarService } from './calendar.service';
import { OptionalAuthGuard } from '../../common/guards/optional-auth.guard';
import {
  GetAvailableSlotsDto,
  BookConsultationDto,
  UpdateConsultationDto,
  GetConsultationsDto,
} from './dto/calendar.dto';

@ApiTags('Calendar')
@Controller('api/calendar')
@UseGuards(OptionalAuthGuard)
export class CalendarController {
  constructor(private readonly calendarService: CalendarService) {}

  @Get('slots/available')
  @ApiOperation({ summary: 'Get available consultation slots' })
  @ApiResponse({ status: 200, description: 'Available slots retrieved successfully' })
  @ApiResponse({ status: 400, description: 'Invalid request parameters' })
  async getAvailableSlots(@Query() query: GetAvailableSlotsDto) {
    const { startDate, endDate, expertId, duration } = query;
    
    return await this.calendarService.getAvailableConsultationSlots(
      new Date(startDate),
      new Date(endDate),
      expertId,
      duration || 60,
    );
  }

  @Post('consultations')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Book a consultation slot' })
  @ApiResponse({ status: 201, description: 'Consultation booked successfully' })
  @ApiResponse({ status: 400, description: 'Invalid request data' })
  @ApiResponse({ status: 409, description: 'Time slot not available' })
  async bookConsultation(@Body() bookConsultationDto: BookConsultationDto) {
    const { customerId, expertName, expertEmail, startTime, endTime, productId, notes } = bookConsultationDto;
    
    return await this.calendarService.bookConsultationSlot(
      customerId,
      expertName,
      expertEmail,
      new Date(startTime),
      new Date(endTime),
      productId,
      notes,
    );
  }

  @Put('consultations/:id')
  @ApiOperation({ summary: 'Update a consultation' })
  @ApiResponse({ status: 200, description: 'Consultation updated successfully' })
  @ApiResponse({ status: 404, description: 'Consultation not found' })
  async updateConsultation(
    @Param('id') id: string,
    @Body() updateConsultationDto: UpdateConsultationDto,
  ) {
    const { startTime, endTime, status, notes } = updateConsultationDto;
    
    return await this.calendarService.updateConsultation(id, {
      startTime: startTime ? new Date(startTime) : undefined,
      endTime: endTime ? new Date(endTime) : undefined,
      status,
      notes,
    });
  }

  @Delete('consultations/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Cancel a consultation' })
  @ApiResponse({ status: 204, description: 'Consultation cancelled successfully' })
  @ApiResponse({ status: 404, description: 'Consultation not found' })
  async cancelConsultation(@Param('id') id: string) {
    await this.calendarService.cancelConsultation(id);
  }

  @Get('consultations/customer/:customerId')
  @ApiOperation({ summary: 'Get customer consultations' })
  @ApiResponse({ status: 200, description: 'Consultations retrieved successfully' })
  async getCustomerConsultations(@Param('customerId') customerId: string) {
    return await this.calendarService.getCustomerConsultations(customerId);
  }

  @Get('consultations/:id')
  @ApiOperation({ summary: 'Get consultation by ID' })
  @ApiResponse({ status: 200, description: 'Consultation retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Consultation not found' })
  async getConsultation(@Param('id') id: string) {
    return await this.calendarService.getConsultation(id);
  }

  @Get('consultations/upcoming')
  @ApiOperation({ summary: 'Get upcoming consultations' })
  @ApiResponse({ status: 200, description: 'Upcoming consultations retrieved successfully' })
  async getUpcomingConsultations(@Query() query: GetConsultationsDto) {
    const { days = 7 } = query;
    return await this.calendarService.getUpcomingConsultations(days);
  }

  @Get('slots/check-availability')
  @ApiOperation({ summary: 'Check if time slot is available' })
  @ApiResponse({ status: 200, description: 'Availability checked successfully' })
  async checkSlotAvailability(
    @Query('startTime') startTime: string,
    @Query('endTime') endTime: string,
    @Query('expertId') expertId?: string,
  ) {
    const isAvailable = await this.calendarService.isConsultationSlotAvailable(
      new Date(startTime),
      new Date(endTime),
      expertId,
    );
    
    return { available: isAvailable };
  }

  @Get('health')
  @ApiOperation({ summary: 'Check calendar service health' })
  @ApiResponse({ status: 200, description: 'Calendar service is healthy' })
  async healthCheck() {
    return {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      timezone: 'Asia/Kuala_Lumpur',
    };
  }
}
