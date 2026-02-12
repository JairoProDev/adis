import { ConfigService } from '@nestjs/config';
interface SendEmailOptions {
    to: string | string[];
    subject: string;
    html: string;
    from?: string;
    replyTo?: string;
}
export declare class EmailService {
    private configService;
    private resend;
    private readonly logger;
    private readonly defaultFrom;
    constructor(configService: ConfigService);
    sendEmail(options: SendEmailOptions): Promise<void>;
    sendWelcomeEmail(to: string, firstName: string): Promise<void>;
    sendVerificationEmail(to: string, verificationUrl: string): Promise<void>;
    sendPasswordResetEmail(to: string, resetUrl: string): Promise<void>;
    sendNewListingNotification(to: string, listingTitle: string, listingUrl: string): Promise<void>;
    sendMessageNotification(to: string, senderName: string, messagePreview: string, conversationUrl: string): Promise<void>;
    sendSubscriptionConfirmation(to: string, planName: string, amount: number): Promise<void>;
    private getWelcomeTemplate;
    private getVerificationTemplate;
    private getPasswordResetTemplate;
    private getNewListingTemplate;
    private getMessageNotificationTemplate;
    private getSubscriptionConfirmationTemplate;
}
export {};
//# sourceMappingURL=email.service.d.ts.map