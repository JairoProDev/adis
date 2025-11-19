import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Stripe from 'stripe';
import { PrismaService } from '@/common/services/prisma.service';
import { EmailService } from '../email/email.service';

@Injectable()
export class PaymentsService {
  private stripe: Stripe;
  private readonly logger = new Logger(PaymentsService.name);

  constructor(
    private prisma: PrismaService,
    private configService: ConfigService,
    private emailService: EmailService,
  ) {
    const apiKey = this.configService.get<string>('STRIPE_SECRET_KEY');

    if (!apiKey) {
      this.logger.warn('STRIPE_SECRET_KEY not configured. Payments disabled.');
      this.stripe = null as any;
    } else {
      this.stripe = new Stripe(apiKey, {
        apiVersion: '2024-12-18.acacia',
      });
    }
  }

  async createCheckoutSession(
    userId: string,
    planId: string,
    businessId?: string,
  ): Promise<string> {
    if (!this.stripe) {
      throw new BadRequestException('Payments not configured');
    }

    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new BadRequestException('User not found');
    }

    const plan = await this.prisma.subscriptionPlan.findUnique({
      where: { id: planId },
    });

    if (!plan) {
      throw new BadRequestException('Plan not found');
    }

    // Create or get Stripe customer
    let stripeCustomerId = user.metadata?.stripeCustomerId as string;

    if (!stripeCustomerId) {
      const customer = await this.stripe.customers.create({
        email: user.email,
        name: `${user.firstName} ${user.lastName}`,
        metadata: {
          userId: user.id,
        },
      });

      stripeCustomerId = customer.id;

      // Save customer ID
      await this.prisma.user.update({
        where: { id: userId },
        data: {
          metadata: {
            ...(user.metadata as object),
            stripeCustomerId,
          },
        },
      });
    }

    // Create checkout session
    const session = await this.stripe.checkout.sessions.create({
      customer: stripeCustomerId,
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: plan.currency.toLowerCase(),
            product_data: {
              name: plan.name,
              description: plan.description || undefined,
            },
            recurring: {
              interval: plan.interval.toLowerCase() as any,
            },
            unit_amount: Math.round(plan.price * 100), // Convert to cents
          },
          quantity: 1,
        },
      ],
      metadata: {
        userId,
        planId,
        businessId: businessId || '',
      },
      success_url: `${this.configService.get('FRONTEND_URL')}/dashboard/billing?success=true&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${this.configService.get('FRONTEND_URL')}/dashboard/billing?canceled=true`,
    });

    return session.url!;
  }

  async handleWebhook(signature: string, payload: Buffer): Promise<void> {
    if (!this.stripe) {
      throw new BadRequestException('Payments not configured');
    }

    const webhookSecret = this.configService.get<string>(
      'STRIPE_WEBHOOK_SECRET',
    );

    let event: Stripe.Event;

    try {
      event = this.stripe.webhooks.constructEvent(
        payload,
        signature,
        webhookSecret!,
      );
    } catch (err) {
      this.logger.error('Webhook signature verification failed', err);
      throw new BadRequestException('Invalid signature');
    }

    this.logger.log(`Processing webhook event: ${event.type}`);

    switch (event.type) {
      case 'checkout.session.completed':
        await this.handleCheckoutCompleted(
          event.data.object as Stripe.Checkout.Session,
        );
        break;

      case 'customer.subscription.updated':
        await this.handleSubscriptionUpdated(
          event.data.object as Stripe.Subscription,
        );
        break;

      case 'customer.subscription.deleted':
        await this.handleSubscriptionDeleted(
          event.data.object as Stripe.Subscription,
        );
        break;

      case 'invoice.payment_succeeded':
        await this.handlePaymentSucceeded(event.data.object as Stripe.Invoice);
        break;

      case 'invoice.payment_failed':
        await this.handlePaymentFailed(event.data.object as Stripe.Invoice);
        break;

      default:
        this.logger.log(`Unhandled event type: ${event.type}`);
    }
  }

  private async handleCheckoutCompleted(
    session: Stripe.Checkout.Session,
  ): Promise<void> {
    const userId = session.metadata?.userId;
    const planId = session.metadata?.planId;
    const businessId = session.metadata?.businessId;

    if (!userId || !planId) {
      this.logger.error('Missing metadata in checkout session');
      return;
    }

    const plan = await this.prisma.subscriptionPlan.findUnique({
      where: { id: planId },
    });

    if (!plan) {
      this.logger.error(`Plan not found: ${planId}`);
      return;
    }

    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      this.logger.error(`User not found: ${userId}`);
      return;
    }

    // Get subscription from Stripe
    const stripeSubscription = await this.stripe.subscriptions.retrieve(
      session.subscription as string,
    );

    // Create subscription in DB
    await this.prisma.subscription.create({
      data: {
        userId,
        businessId: businessId || undefined,
        planId,
        status: 'ACTIVE',
        currentPeriodStart: new Date(
          stripeSubscription.current_period_start * 1000,
        ),
        currentPeriodEnd: new Date(
          stripeSubscription.current_period_end * 1000,
        ),
        stripeSubscriptionId: stripeSubscription.id,
      },
    });

    // Create transaction record
    const transaction = await this.prisma.transaction.create({
      data: {
        userId,
        amount: plan.price,
        currency: plan.currency,
        type: 'SUBSCRIPTION',
        provider: 'STRIPE',
        providerTransactionId: session.payment_intent as string,
        status: 'COMPLETED',
      },
    });

    // Create revenue shares
    await this.createRevenueShares(transaction.id, plan.price, userId);

    // Send confirmation email
    await this.emailService.sendSubscriptionConfirmation(
      user.email,
      plan.name,
      plan.price,
    );

    this.logger.log(`Subscription created for user ${userId}`);
  }

  private async handleSubscriptionUpdated(
    subscription: Stripe.Subscription,
  ): Promise<void> {
    await this.prisma.subscription.updateMany({
      where: { stripeSubscriptionId: subscription.id },
      data: {
        status: subscription.status.toUpperCase() as any,
        currentPeriodStart: new Date(subscription.current_period_start * 1000),
        currentPeriodEnd: new Date(subscription.current_period_end * 1000),
      },
    });

    this.logger.log(`Subscription updated: ${subscription.id}`);
  }

  private async handleSubscriptionDeleted(
    subscription: Stripe.Subscription,
  ): Promise<void> {
    await this.prisma.subscription.updateMany({
      where: { stripeSubscriptionId: subscription.id },
      data: {
        status: 'CANCELED',
        canceledAt: new Date(),
      },
    });

    this.logger.log(`Subscription canceled: ${subscription.id}`);
  }

  private async handlePaymentSucceeded(invoice: Stripe.Invoice): Promise<void> {
    this.logger.log(`Payment succeeded for invoice: ${invoice.id}`);
  }

  private async handlePaymentFailed(invoice: Stripe.Invoice): Promise<void> {
    this.logger.log(`Payment failed for invoice: ${invoice.id}`);

    // Mark subscription as past_due
    if (invoice.subscription) {
      await this.prisma.subscription.updateMany({
        where: { stripeSubscriptionId: invoice.subscription as string },
        data: { status: 'PAST_DUE' },
      });
    }
  }

  private async createRevenueShares(
    transactionId: string,
    amount: number,
    userId: string,
  ): Promise<void> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: { tenant: true },
    });

    if (!user) return;

    // Platform gets base percentage
    const platformPercentage = user.tenant.revenueSharePercentage;
    const platformAmount = (amount * platformPercentage) / 100;

    await this.prisma.revenueShare.create({
      data: {
        transactionId,
        recipientType: 'PLATFORM',
        recipientId: user.tenantId,
        amount: platformAmount,
        percentage: platformPercentage,
        status: 'PENDING',
      },
    });

    // If user was acquired by someone, they get a share
    if (user.acquiredBy) {
      const referrerPercentage = 10; // 10% to referrer
      const referrerAmount = (amount * referrerPercentage) / 100;

      await this.prisma.revenueShare.create({
        data: {
          transactionId,
          recipientType: 'REFERRER',
          recipientId: user.acquiredBy,
          amount: referrerAmount,
          percentage: referrerPercentage,
          status: 'PENDING',
        },
      });
    }

    this.logger.log(`Revenue shares created for transaction ${transactionId}`);
  }

  async cancelSubscription(userId: string, subscriptionId: string): Promise<void> {
    const subscription = await this.prisma.subscription.findFirst({
      where: {
        id: subscriptionId,
        userId,
      },
    });

    if (!subscription) {
      throw new BadRequestException('Subscription not found');
    }

    if (!subscription.stripeSubscriptionId) {
      throw new BadRequestException('Stripe subscription not found');
    }

    // Cancel in Stripe
    await this.stripe.subscriptions.cancel(subscription.stripeSubscriptionId);

    // Update in DB (webhook will handle this too)
    await this.prisma.subscription.update({
      where: { id: subscriptionId },
      data: {
        status: 'CANCELED',
        canceledAt: new Date(),
      },
    });

    this.logger.log(`Subscription canceled: ${subscriptionId}`);
  }
}
