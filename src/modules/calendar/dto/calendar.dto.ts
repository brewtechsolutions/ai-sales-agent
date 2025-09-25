import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsDateString, IsInt, IsEnum, Min, Max } from 'class-validator';

export class GetAvailableSlotsDto {
  @ApiProperty({ description: 'Start date for slot search', example: '2024-01-01' })
  @IsDateString()
  startDate: string;

  @ApiProperty({ description: 'End date for slot search', example: '2024-01-07' })
  @IsDateString()
  endDate: string;

  @ApiProperty({ description: 'Expert ID to filter slots', required: false })
  @IsOptional()
  @IsString()
  expertId?: string;

  @ApiProperty({ description: 'Duration in minutes', required: false, default: 60 })
  @IsOptional()
  @IsInt()
  @Min(15)
  @Max(240)
  duration?: number;
}

export class BookConsultationDto {
  @ApiProperty({ description: 'Customer ID' })
  @IsString()
  customerId: string;

  @ApiProperty({ description: 'Expert name' })
  @IsString()
  expertName: string;

  @ApiProperty({ description: 'Expert email' })
  @IsString()
  expertEmail: string;

  @ApiProperty({ description: 'Start time', example: '2024-01-01T10:00:00Z' })
  @IsDateString()
  startTime: string;

  @ApiProperty({ description: 'End time', example: '2024-01-01T11:00:00Z' })
  @IsDateString()
  endTime: string;

  @ApiProperty({ description: 'Product ID', required: false })
  @IsOptional()
  @IsString()
  productId?: string;

  @ApiProperty({ description: 'Additional notes', required: false })
  @IsOptional()
  @IsString()
  notes?: string;
}

export class UpdateConsultationDto {
  @ApiProperty({ description: 'New start time', required: false })
  @IsOptional()
  @IsDateString()
  startTime?: string;

  @ApiProperty({ description: 'New end time', required: false })
  @IsOptional()
  @IsDateString()
  endTime?: string;

  @ApiProperty({ 
    description: 'Consultation status', 
    enum: ['SCHEDULED', 'CONFIRMED', 'COMPLETED', 'CANCELLED', 'NO_SHOW'],
    required: false 
  })
  @IsOptional()
  @IsEnum(['SCHEDULED', 'CONFIRMED', 'COMPLETED', 'CANCELLED', 'NO_SHOW'])
  status?: string;

  @ApiProperty({ description: 'Additional notes', required: false })
  @IsOptional()
  @IsString()
  notes?: string;
}

export class GetConsultationsDto {
  @ApiProperty({ description: 'Number of days to look ahead', required: false, default: 7 })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(30)
  days?: number;
}

export class TimeSlotDto {
  @ApiProperty({ description: 'Slot start time' })
  start: Date;

  @ApiProperty({ description: 'Slot end time' })
  end: Date;

  @ApiProperty({ description: 'Slot title' })
  title: string;

  @ApiProperty({ description: 'Slot description' })
  description: string;
}

export class ConsultationDto {
  @ApiProperty({ description: 'Consultation ID' })
  id: string;

  @ApiProperty({ description: 'Customer ID' })
  customerId: string;

  @ApiProperty({ description: 'Product ID', required: false })
  productId?: string;

  @ApiProperty({ description: 'Expert name' })
  expertName: string;

  @ApiProperty({ description: 'Expert email' })
  expertEmail: string;

  @ApiProperty({ description: 'Scheduled time' })
  scheduledAt: Date;

  @ApiProperty({ description: 'Duration in minutes' })
  duration: number;

  @ApiProperty({ description: 'Consultation status' })
  status: string;

  @ApiProperty({ description: 'Meeting link', required: false })
  meetingLink?: string;

  @ApiProperty({ description: 'Notes', required: false })
  notes?: string;

  @ApiProperty({ description: 'Created at' })
  createdAt: Date;

  @ApiProperty({ description: 'Updated at' })
  updatedAt: Date;
}
