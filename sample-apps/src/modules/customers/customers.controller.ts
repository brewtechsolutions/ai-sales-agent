import { Controller, Get, Post, Put, Body, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CustomersService } from './customers.service';
import { OptionalAuthGuard } from '../../common/guards/optional-auth.guard';

@ApiTags('Customers')
@Controller('api/customers')
@UseGuards(OptionalAuthGuard)
export class CustomersController {
  constructor(private readonly customersService: CustomersService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new customer' })
  @ApiResponse({ status: 201, description: 'Customer created successfully' })
  async createCustomer(@Body() customerData: any) {
    return await this.customersService.createCustomer(customerData);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get customer by ID' })
  @ApiResponse({ status: 200, description: 'Customer retrieved successfully' })
  async getCustomer(@Param('id') id: string) {
    return await this.customersService.getCustomer(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update customer' })
  @ApiResponse({ status: 200, description: 'Customer updated successfully' })
  async updateCustomer(@Param('id') id: string, @Body() updateData: any) {
    return await this.customersService.updateCustomer(id, updateData);
  }

  @Get()
  @ApiOperation({ summary: 'Get customers with pagination' })
  @ApiResponse({ status: 200, description: 'Customers retrieved successfully' })
  async getCustomers(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
    @Query('search') search?: string,
  ) {
    return await this.customersService.getCustomers(page, limit, search);
  }
}
