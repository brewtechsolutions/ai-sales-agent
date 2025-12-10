import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Razorpay from 'razorpay';

@Injectable()
export class CurlecService {
  private readonly logger = new Logger(CurlecService.name);
  private readonly razorpay: Razorpay;
  private readonly webhookSecret: string;

  constructor(private configService: ConfigService) {
    this.razorpay = new Razorpay({
      key_id: this.configService.get<string>('payment.curlec.publishableKey'),
      key_secret: this.configService.get<string>('payment.curlec.secretKey'),
    });
    this.webhookSecret = this.configService.get<string>('payment.curlec.webhookSecret');
  }

  /**
   * Create a payment order
   */
  async createPaymentOrder(
    amount: number,
    currency: string = 'MYR',
    customerId: string,
    description?: string,
    metadata?: Record<string, any>,
  ): Promise<PaymentOrder> {
    try {
      const options = {
        amount: Math.round(amount * 100), // Convert to cents
        currency: currency.toLowerCase(),
        receipt: `receipt_${customerId}_${Date.now()}`,
        notes: {
          customer_id: customerId,
          description: description || 'AI Sales Agent Payment',
          ...metadata,
        },
      };

      const order = await this.razorpay.orders.create(options);

      this.logger.log(`Created payment order: ${order.id}`);
      return {
        id: order.id,
        amount: order.amount,
        currency: order.currency,
        status: 'created',
        receipt: order.receipt,
        notes: order.notes,
        created_at: order.created_at,
      };
    } catch (error) {
      this.logger.error('Error creating payment order:', error);
      throw new Error('Failed to create payment order');
    }
  }

  /**
   * Verify payment signature
   */
  async verifyPaymentSignature(
    razorpayOrderId: string,
    razorpayPaymentId: string,
    razorpaySignature: string,
  ): Promise<boolean> {
    try {
      const crypto = require('crypto');
      const expectedSignature = crypto
        .createHmac('sha256', this.webhookSecret)
        .update(`${razorpayOrderId}|${razorpayPaymentId}`)
        .digest('hex');

      const isValid = expectedSignature === razorpaySignature;
      
      if (isValid) {
        this.logger.log(`Payment signature verified for order: ${razorpayOrderId}`);
      } else {
        this.logger.warn(`Invalid payment signature for order: ${razorpayOrderId}`);
      }
      
      return isValid;
    } catch (error) {
      this.logger.error('Error verifying payment signature:', error);
      return false;
    }
  }

  /**
   * Retrieve a payment order
   */
  async getPaymentOrder(orderId: string): Promise<PaymentOrder> {
    try {
      const order = await this.razorpay.orders.fetch(orderId);
      
      return {
        id: order.id,
        amount: order.amount,
        currency: order.currency,
        status: order.status,
        receipt: order.receipt,
        notes: order.notes,
        created_at: order.created_at,
      };
    } catch (error) {
      this.logger.error('Error retrieving payment order:', error);
      throw new Error('Failed to retrieve payment order');
    }
  }

  /**
   * Cancel a payment order
   */
  async cancelPaymentOrder(orderId: string): Promise<PaymentOrder> {
    try {
      // Note: Razorpay doesn't have a direct cancel method for orders
      // Orders are automatically cancelled if not paid within 15 minutes
      this.logger.log(`Order ${orderId} will be auto-cancelled if not paid within 15 minutes`);
      
      // Return the current order status
      return await this.getPaymentOrder(orderId);
    } catch (error) {
      this.logger.error('Error cancelling payment order:', error);
      throw new Error('Failed to cancel payment order');
    }
  }

  /**
   * Create a refund
   */
  async createRefund(
    paymentId: string,
    amount?: number,
    reason?: string,
  ): Promise<Refund> {
    try {
      const options: any = {
        payment_id: paymentId,
      };

      if (amount) {
        options.amount = Math.round(amount * 100); // Convert to cents
      }

      if (reason) {
        options.notes = { reason };
      }

      const refund = await this.razorpay.payments.refund(paymentId, options);

      this.logger.log(`Created refund: ${refund.id}`);
      return {
        id: refund.id,
        amount: refund.amount,
        currency: refund.currency,
        status: refund.status,
        payment_id: refund.payment_id,
        notes: refund.notes,
        created_at: refund.created_at,
      };
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
        case 'payment.captured':
          await this.handlePaymentSucceeded(event.data);
          break;
        case 'payment.failed':
          await this.handlePaymentFailed(event.data);
          break;
        case 'order.paid':
          await this.handleOrderPaid(event.data);
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

  private async handleOrderPaid(data: any): Promise<void> {
    this.logger.log(`Order paid: ${data.id}`);
    // Update order status in database
    // Send confirmation email/SMS
    // Update inventory
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

export interface PaymentOrder {
  id: string;
  amount: number;
  currency: string;
  status: 'created' | 'attempted' | 'paid' | 'cancelled';
  receipt: string;
  notes?: Record<string, any>;
  created_at: number;
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
  payment_id: string;
  notes?: Record<string, any>;
  created_at: number;
}

export interface WebhookEvent {
  id: string;
  type: string;
  data: any;
  created: number;
}
