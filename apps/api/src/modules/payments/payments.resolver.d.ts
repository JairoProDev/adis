import { PaymentsService } from './payments.service';
export declare class PaymentsResolver {
    private paymentsService;
    constructor(paymentsService: PaymentsService);
    createCheckoutSession(user: any, planId: string, businessId?: string): Promise<string>;
    cancelSubscription(user: any, subscriptionId: string): Promise<boolean>;
}
//# sourceMappingURL=payments.resolver.d.ts.map