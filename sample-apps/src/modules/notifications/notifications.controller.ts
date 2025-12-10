import { Controller, Post, Get, Body, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { NotificationsService } from './notifications.service';
import { OptionalAuthGuard } from '../../common/guards/optional-auth.guard';

@ApiTags('Notifications')
@Controller('api/notifications')
@UseGuards(OptionalAuthGuard)
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Post()
  @ApiOperation({ summary: 'Send notification' })
  @ApiResponse({ status: 201, description: 'Notification sent successfully' })
  async sendNotification(@Body() notificationData: any) {
    return await this.notificationsService.sendNotification(
      notificationData.customerId,
      notificationData.type,
      notificationData.title,
      notificationData.content,
      notificationData.metadata,
    );
  }

  @Get('customer/:customerId')
  @ApiOperation({ summary: 'Get customer notifications' })
  @ApiResponse({ status: 200, description: 'Notifications retrieved successfully' })
  async getNotifications(
    @Param('customerId') customerId: string,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ) {
    return await this.notificationsService.getNotifications(customerId, page, limit);
  }
}
