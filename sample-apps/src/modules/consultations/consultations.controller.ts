import { Controller, Get, Put, Body, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { ConsultationsService } from './consultations.service';
import { OptionalAuthGuard } from '../../common/guards/optional-auth.guard';

@ApiTags('Consultations')
@Controller('api/consultations')
@UseGuards(OptionalAuthGuard)
export class ConsultationsController {
  constructor(private readonly consultationsService: ConsultationsService) {}

  @Get()
  @ApiOperation({ summary: 'Get consultations with pagination' })
  @ApiResponse({ status: 200, description: 'Consultations retrieved successfully' })
  async getConsultations(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
    @Query('status') status?: string,
  ) {
    return await this.consultationsService.getConsultations(page, limit, status);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get consultation by ID' })
  @ApiResponse({ status: 200, description: 'Consultation retrieved successfully' })
  async getConsultation(@Param('id') id: string) {
    return await this.consultationsService.getConsultation(id);
  }

  @Put(':id/status')
  @ApiOperation({ summary: 'Update consultation status' })
  @ApiResponse({ status: 200, description: 'Status updated successfully' })
  async updateConsultationStatus(
    @Param('id') id: string,
    @Body() updateData: { status: string; notes?: string },
  ) {
    return await this.consultationsService.updateConsultationStatus(
      id,
      updateData.status,
      updateData.notes,
    );
  }
}
