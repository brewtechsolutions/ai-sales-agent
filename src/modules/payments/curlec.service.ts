import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';

@Injectable()
export class CurlecService {
  private readonly logger = new Logger(CurlecService.name);
  private readonly baseUrl: string;
  private readonly secretKey: string;
  private readonly publishableKey: string;
  private readonly webhookSecret: string;

  constructor(private configService: ConfigService) {
    this.secretKey = this.configService.get<string>('payment.curlec.secretKey');
    this.publishableKey = this.configService.get<string>('payment.curlec.publishableKey');
    this.webhookSecret = this.configService.get<string>('payment.curlec.webhookSecret');
    this.baseUrl = 'https://api.curlec.com'; // Replace with actual Curlec API URL
  }

  /**
   * Create a payment intent
   */
  async createPaymentIntent(
    amount: number,
    currency: string = 'MYR',
    customerId: string,
    description?: string,
    metadata?: Record<string, any>,
  ): Promise<PaymentIntent> {
    try {
      const response = await axios.post(
        `${this.baseUrl}/v1/payment_intents`,
        {
          amount: Math.round(amount * 100), // Convert to cents
          currency: currency.toLowerCase(),
          customer: customerId,
          description,
          metadata,
          payment_method_types: ['card', 'fpx', 'grabpay', 'boost'],
        },
        {
          headers: {
            'Authorization': `Bearer ${this.secretKey}`,
            'Content-Type': 'application/json',
          },
        },
      );

      this.logger.log(`Created payment intent: ${response.data.id}`);
      return response.data;
    } catch (error) {
      this.logger.error('Error creating payment intent:', error);
      throw new Error('Failed to create payment intent');
    }
  }

  /**
   * Confirm a payment intent
   */
  async confirmPaymentIntent(
    paymentIntentId: string,
    paymentMethodId: string,
  ): Promise<PaymentIntent> {
    try {
      const response = await axios.post(
        `${this.baseUrl}/v1/payment_intents/${paymentIntentId}/confirm`,
        {
          payment_method: paymentMethodId,
        },
        {
          headers: {
            'Authorization': `Bearer ${this.secretKey}`,
            'Content-Type': 'application/json',
          },
        },
      );

      this.logger.log(`Confirmed payment intent: ${paymentIntentId}`);
      return response.data;
    } catch (error) {
      this.logger.error('Error confirming payment intent:', error);
      throw new Error('Failed to confirm payment intent');
    }
  }

  /**
   * Retrieve a payment intent
   */
  async getPaymentIntent(paymentIntentId: string): Promise<PaymentIntent> {
    try {
      const response = await axios.get(
        `${this.baseUrl}/v1/payment_intents/${paymentIntentId}`,
        {
          headers: {
            'Authorization': `Bearer ${this.secretKey}`,
          },
        },
      );

      return response.data;
    } catch (error) {
      this.logger.error('Error retrieving payment intent:', error);
      throw new Error('Failed to retrieve payment intent');
    }
  }

  /**
   * Cancel a payment intent
   */
  async cancelPaymentIntent(paymentIntentId: string): Promise<PaymentIntent> {
    try {
      const response = await axios.post(
        `${this.baseUrl}/v1/payment_intents/${paymentIntentId}/cancel`,
        {},
        {
          headers: {
            'Authorization': `Bearer ${this.secretKey}`,
            'Content-Type': 'application/json',
          },
        },
      );

      this.logger.log(`Cancelled payment intent: ${paymentIntentId}`);
      return response.data;
    } catch (error) {
      this.logger.error('Error cancelling payment intent:', error);
      throw new Error('Failed to cancel payment intent');
    }
  }

  /**
   * Create a refund
   */
  async createRefund(
    paymentIntentId: string,
    amount?: number,
    reason?: string,
  ): Promise<Refund> {
    try {
      const response = await axios.post(
        `${this.baseUrl}/v1/refunds`,
        {
          payment_intent: paymentIntentId,
          amount: amount ? Math.round(amount * 100) : undefined,
          reason,
        },
        {
          headers: {
            'Authorization': `Bearer ${this.secretKey}`,
            'Content-Type': 'application/json',
          },
        },
      );

      this.logger.log(`Created refund: ${response.data.id}`);
      return response.data;
    } catch (error) {
      this.logger.error('Error creating refund:', error);
      throw new Error('Failed to create refund');
    }
  }

  /**
   * Get available payment methods
   */
  async getAvailablePaymentMethods(): Promise<PaymentMethod[]> {
    try {
      // Return Malaysian payment methods
      return [
        {
          id: 'card',
          type: 'card',
          name: 'Credit/Debit Card',
          description: 'Visa, Mastercard, American Express',
          icon: 'credit-card',
          enabled: true,
        },
        {
          id: 'fpx',
          type: 'fpx',
          name: 'FPX Online Banking',
          description: 'Maybank, CIMB, Public Bank, and more',
          icon: 'bank',
          enabled: true,
        },
        {
          id: 'grabpay',
          type: 'grabpay',
          name: 'GrabPay',
          description: 'Pay with GrabPay wallet',
          icon: 'wallet',
          enabled: true,
        },
        {
          id: 'boost',
          type: 'boost',
          name: 'Boost',
          description: 'Pay with Boost wallet',
          icon: 'wallet',
          enabled: true,
        },
        {
          id: 'tng',
          type: 'tng',
          name: 'Touch \'n Go eWallet',
          description: 'Pay with TnG eWallet',
          icon: 'wallet',
          enabled: true,
        },
      ];
    } catch (error) {
      this.logger.error('Error getting payment methods:', error);
      return [];
    }
  }

  /**
   * Verify webhook signature
   */
  verifyWebhookSignature(payload: string, signature: string): boolean {
    try {
      // Implement webhook signature verification
      // This is a simplified version - implement proper HMAC verification
      const expectedSignature = this.generateWebhookSignature(payload);
      return signature === expectedSignature;
    } catch (error) {
      this.logger.error('Error verifying webhook signature:', error);
      return false;
    }
  }

  /**
   * Process webhook event
   */
  async processWebhookEvent(event: WebhookEvent): Promise<void> {
    try {
      this.logger.log(`Processing webhook event: ${event.type}`);

      switch (event.type) {
        case 'payment_intent.succeeded':
          await this.handlePaymentSucceeded(event.data);
          break;
        case 'payment_intent.payment_failed':
          await this.handlePaymentFailed(event.data);
          break;
        case 'payment_intent.cancelled':
          await this.handlePaymentCancelled(event.data);
          break;
        case 'refund.created':
          await this.handleRefundCreated(event.data);
          break;
        default:
          this.logger.warn(`Unhandled webhook event type: ${event.type}`);
      }
    } catch (error) {
      this.logger.error('Error processing webhook event:', error);
      throw error;
    }
  }

  private async handlePaymentSucceeded(data: any): Promise<void> {
    this.logger.log(`Payment succeeded: ${data.id}`);
    // Update payment status in database
    // Send confirmation email/SMS
    // Update order status
  }

  private async handlePaymentFailed(data: any): Promise<void> {
    this.logger.log(`Payment failed: ${data.id}`);
    // Update payment status in database
    // Send failure notification
    // Handle retry logic
  }

  private async handlePaymentCancelled(data: any): Promise<void> {
    this.logger.log(`Payment cancelled: ${data.id}`);
    // Update payment status in database
    // Release reserved inventory
  }

  private async handleRefundCreated(data: any): Promise<void> {
    this.logger.log(`Refund created: ${data.id}`);
    // Update payment status in database
    // Send refund confirmation
  }

  private generateWebhookSignature(payload: string): string {
    // Implement proper HMAC-SHA256 signature generation
    // This is a simplified version
    const crypto = require('crypto');
    return crypto
      .createHmac('sha256', this.webhookSecret)
      .update(payload)
      .digest('hex');
  }
}

export interface PaymentIntent {
  id: string;
  amount: number;
  currency: string;
  status: 'requires_payment_method' | 'requires_confirmation' | 'requires_action' | 'processing' | 'succeeded' | 'cancelled';
  client_secret: string;
  customer: string;
  description?: string;
  metadata?: Record<string, any>;
  created: number;
}

export interface PaymentMethod {
  id: string;
  type: string;
  name: string;
  description: string;
  icon: string;
  enabled: boolean;
}

export interface Refund {
  id: string;
  amount: number;
  currency: string;
  status: 'succeeded' | 'pending' | 'failed' | 'cancelled';
  payment_intent: string;
  reason?: string;
  created: number;
}

export interface WebhookEvent {
  id: string;
  type: string;
  data: any;
  created: number;
}
