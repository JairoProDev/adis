import { ConfigService } from '@nestjs/config';
import { PrismaService } from '@/common/services/prisma.service';
import { EmailService } from '../email/email.service';
export declare class PaymentsService {
    private prisma;
    private configService;
    private emailService;
    private stripe;
    private readonly logger;
    constructor(prisma: PrismaService, configService: ConfigService, emailService: EmailService);
    createCheckoutSession(userId: string, planId: string, businessId?: string): Promise<string>;
    handleWebhook(signature: string, payload: Buffer): Promise<void>;
    private handleCheckoutCompleted;
    private handleSubscriptionUpdated;
    private handleSubscriptionDeleted;
    private handlePaymentSucceeded;
    private handlePaymentFailed;
    private createRevenueShares;
    cancelSubscription(userId: string, subscriptionId: string): Promise<void>;
}
//# sourceMappingURL=payments.service.d.ts.map