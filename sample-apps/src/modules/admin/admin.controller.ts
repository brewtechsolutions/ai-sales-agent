import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AdminService } from './admin.service';
import { OptionalAuthGuard } from '../../common/guards/optional-auth.guard';

@ApiTags('Admin')
@Controller('api/admin')
@UseGuards(OptionalAuthGuard)
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get('dashboard')
  @ApiOperation({ summary: 'Get dashboard statistics' })
  @ApiResponse({ status: 200, description: 'Dashboard stats retrieved successfully' })
  async getDashboardStats() {
    return await this.adminService.getDashboardStats();
  }

  @Get('health')
  @ApiOperation({ summary: 'Get system health status' })
  @ApiResponse({ status: 200, description: 'Health status retrieved successfully' })
  async getSystemHealth() {
    return await this.adminService.getSystemHealth();
  }
}
