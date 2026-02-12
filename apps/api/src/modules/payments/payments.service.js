"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var PaymentsService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentsService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const stripe_1 = __importDefault(require("stripe"));
const prisma_service_1 = require("../../common/services/prisma.service");
const email_service_1 = require("../email/email.service");
let PaymentsService = PaymentsService_1 = class PaymentsService {
    constructor(prisma, configService, emailService) {
        this.prisma = prisma;
        this.configService = configService;
        this.emailService = emailService;
        this.logger = new common_1.Logger(PaymentsService_1.name);
        const apiKey = this.configService.get('STRIPE_SECRET_KEY');
        if (!apiKey) {
            this.logger.warn('STRIPE_SECRET_KEY not configured. Payments disabled.');
            this.stripe = null;
        }
        else {
            this.stripe = new stripe_1.default(apiKey, {
                apiVersion: '2024-12-18.acacia',
            });
        }
    }
    async createCheckoutSession(userId, planId, businessId) {
        if (!this.stripe) {
            throw new common_1.BadRequestException('Payments not configured');
        }
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
        });
        if (!user) {
            throw new common_1.BadRequestException('User not found');
        }
        const plan = await this.prisma.subscriptionPlan.findUnique({
            where: { id: planId },
        });
        if (!plan) {
            throw new common_1.BadRequestException('Plan not found');
        }
        // Create or get Stripe customer
        let stripeCustomerId = user.metadata?.stripeCustomerId;
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
                        ...user.metadata,
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
                            interval: plan.interval.toLowerCase(),
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
        return session.url;
    }
    async handleWebhook(signature, payload) {
        if (!this.stripe) {
            throw new common_1.BadRequestException('Payments not configured');
        }
        const webhookSecret = this.configService.get('STRIPE_WEBHOOK_SECRET');
        let event;
        try {
            event = this.stripe.webhooks.constructEvent(payload, signature, webhookSecret);
        }
        catch (err) {
            this.logger.error('Webhook signature verification failed', err);
            throw new common_1.BadRequestException('Invalid signature');
        }
        this.logger.log(`Processing webhook event: ${event.type}`);
        switch (event.type) {
            case 'checkout.session.completed':
                await this.handleCheckoutCompleted(event.data.object);
                break;
            case 'customer.subscription.updated':
                await this.handleSubscriptionUpdated(event.data.object);
                break;
            case 'customer.subscription.deleted':
                await this.handleSubscriptionDeleted(event.data.object);
                break;
            case 'invoice.payment_succeeded':
                await this.handlePaymentSucceeded(event.data.object);
                break;
            case 'invoice.payment_failed':
                await this.handlePaymentFailed(event.data.object);
                break;
            default:
                this.logger.log(`Unhandled event type: ${event.type}`);
        }
    }
    async handleCheckoutCompleted(session) {
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
        const stripeSubscription = await this.stripe.subscriptions.retrieve(session.subscription);
        // Create subscription in DB
        await this.prisma.subscription.create({
            data: {
                userId,
                businessId: businessId || undefined,
                planId,
                status: 'ACTIVE',
                currentPeriodStart: new Date(stripeSubscription.current_period_start * 1000),
                currentPeriodEnd: new Date(stripeSubscription.current_period_end * 1000),
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
                providerTransactionId: session.payment_intent,
                status: 'COMPLETED',
            },
        });
        // Create revenue shares
        await this.createRevenueShares(transaction.id, plan.price, userId);
        // Send confirmation email
        await this.emailService.sendSubscriptionConfirmation(user.email, plan.name, plan.price);
        this.logger.log(`Subscription created for user ${userId}`);
    }
    async handleSubscriptionUpdated(subscription) {
        await this.prisma.subscription.updateMany({
            where: { stripeSubscriptionId: subscription.id },
            data: {
                status: subscription.status.toUpperCase(),
                currentPeriodStart: new Date(subscription.current_period_start * 1000),
                currentPeriodEnd: new Date(subscription.current_period_end * 1000),
            },
        });
        this.logger.log(`Subscription updated: ${subscription.id}`);
    }
    async handleSubscriptionDeleted(subscription) {
        await this.prisma.subscription.updateMany({
            where: { stripeSubscriptionId: subscription.id },
            data: {
                status: 'CANCELED',
                canceledAt: new Date(),
            },
        });
        this.logger.log(`Subscription canceled: ${subscription.id}`);
    }
    async handlePaymentSucceeded(invoice) {
        this.logger.log(`Payment succeeded for invoice: ${invoice.id}`);
    }
    async handlePaymentFailed(invoice) {
        this.logger.log(`Payment failed for invoice: ${invoice.id}`);
        // Mark subscription as past_due
        if (invoice.subscription) {
            await this.prisma.subscription.updateMany({
                where: { stripeSubscriptionId: invoice.subscription },
                data: { status: 'PAST_DUE' },
            });
        }
    }
    async createRevenueShares(transactionId, amount, userId) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
            include: { tenant: true },
        });
        if (!user)
            return;
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
    async cancelSubscription(userId, subscriptionId) {
        const subscription = await this.prisma.subscription.findFirst({
            where: {
                id: subscriptionId,
                userId,
            },
        });
        if (!subscription) {
            throw new common_1.BadRequestException('Subscription not found');
        }
        if (!subscription.stripeSubscriptionId) {
            throw new common_1.BadRequestException('Stripe subscription not found');
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
};
exports.PaymentsService = PaymentsService;
exports.PaymentsService = PaymentsService = PaymentsService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        config_1.ConfigService,
        email_service_1.EmailService])
], PaymentsService);
//# sourceMappingURL=payments.service.js.map