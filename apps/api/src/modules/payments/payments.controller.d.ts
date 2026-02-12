import { RawBodyRequest } from '@nestjs/common';
import { Request } from 'express';
import { PaymentsService } from './payments.service';
export declare class PaymentsController {
    private paymentsService;
    constructor(paymentsService: PaymentsService);
    handleStripeWebhook(signature: string, req: RawBodyRequest<Request>): Promise<{
        received: boolean;
    }>;
}
//# sourceMappingURL=payments.controller.d.ts.map