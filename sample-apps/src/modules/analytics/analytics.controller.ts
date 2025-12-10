import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AnalyticsService } from './analytics.service';
import { OptionalAuthGuard } from '../../common/guards/optional-auth.guard';

@ApiTags('Analytics')
@Controller('api/analytics')
@UseGuards(OptionalAuthGuard)
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Get('conversations')
  @ApiOperation({ summary: 'Get conversation analytics' })
  @ApiResponse({ status: 200, description: 'Analytics retrieved successfully' })
  async getConversationAnalytics() {
    return await this.analyticsService.getConversationAnalytics();
  }

  @Get('sales')
  @ApiOperation({ summary: 'Get sales analytics' })
  @ApiResponse({ status: 200, description: 'Analytics retrieved successfully' })
  async getSalesAnalytics() {
    return await this.analyticsService.getSalesAnalytics();
  }
}
