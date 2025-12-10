import { Controller, Get, Post, Put, Body, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { PaymentsService } from './payments.service';
import { OptionalAuthGuard } from '../../common/guards/optional-auth.guard';

@ApiTags('Payments')
@Controller('api/payments')
@UseGuards(OptionalAuthGuard)
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a payment' })
  @ApiResponse({ status: 201, description: 'Payment created successfully' })
  async createPayment(@Body() paymentData: any) {
    return await this.paymentsService.createPayment(
      paymentData.customerId,
      paymentData.amount,
      paymentData.currency,
      paymentData.description,
      paymentData.metadata,
    );
  }

  @Post(':id/confirm')
  @ApiOperation({ summary: 'Confirm a payment' })
  @ApiResponse({ status: 200, description: 'Payment confirmed successfully' })
  async confirmPayment(
    @Param('id') id: string,
    @Body() confirmData: { paymentMethodId: string },
  ) {
    return await this.paymentsService.confirmPayment(id, confirmData.paymentMethodId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get payment by ID' })
  @ApiResponse({ status: 200, description: 'Payment retrieved successfully' })
  async getPayment(@Param('id') id: string) {
    return await this.paymentsService.getPayment(id);
  }

  @Get('customer/:customerId')
  @ApiOperation({ summary: 'Get customer payments' })
  @ApiResponse({ status: 200, description: 'Payments retrieved successfully' })
  async getCustomerPayments(
    @Param('customerId') customerId: string,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ) {
    return await this.paymentsService.getCustomerPayments(customerId, page, limit);
  }

  @Post(':id/refund')
  @ApiOperation({ summary: 'Create a refund' })
  @ApiResponse({ status: 201, description: 'Refund created successfully' })
  async createRefund(
    @Param('id') id: string,
    @Body() refundData: { amount?: number; reason?: string },
  ) {
    return await this.paymentsService.createRefund(
      id,
      refundData.amount,
      refundData.reason,
    );
  }

  @Get('methods/available')
  @ApiOperation({ summary: 'Get available payment methods' })
  @ApiResponse({ status: 200, description: 'Payment methods retrieved successfully' })
  async getAvailablePaymentMethods() {
    return await this.paymentsService.getAvailablePaymentMethods();
  }

  @Post('webhook')
  @ApiOperation({ summary: 'Handle payment webhook' })
  @ApiResponse({ status: 200, description: 'Webhook processed successfully' })
  async handleWebhook(@Body() webhookData: any) {
    return await this.paymentsService.processWebhookEvent(webhookData);
  }

  @Get('analytics/overview')
  @ApiOperation({ summary: 'Get payment analytics' })
  @ApiResponse({ status: 200, description: 'Analytics retrieved successfully' })
  async getPaymentAnalytics() {
    return await this.paymentsService.getPaymentAnalytics();
  }
}
