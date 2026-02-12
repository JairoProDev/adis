import { OnModuleInit, OnModuleDestroy } from '@nestjs/common';
export declare class PrismaService implements OnModuleInit, OnModuleDestroy {
    private client;
    onModuleInit(): Promise<void>;
    onModuleDestroy(): Promise<void>;
    get user(): import(".prisma/client").Prisma.UserDelegate<import("@prisma/client/runtime/library").DefaultArgs>;
    get business(): import(".prisma/client").Prisma.BusinessDelegate<import("@prisma/client/runtime/library").DefaultArgs>;
    get listing(): import(".prisma/client").Prisma.ListingDelegate<import("@prisma/client/runtime/library").DefaultArgs>;
    get category(): import(".prisma/client").Prisma.CategoryDelegate<import("@prisma/client/runtime/library").DefaultArgs>;
    get tenant(): import(".prisma/client").Prisma.TenantDelegate<import("@prisma/client/runtime/library").DefaultArgs>;
    get subscription(): import(".prisma/client").Prisma.SubscriptionDelegate<import("@prisma/client/runtime/library").DefaultArgs>;
    get transaction(): import(".prisma/client").Prisma.TransactionDelegate<import("@prisma/client/runtime/library").DefaultArgs>;
    get conversation(): import(".prisma/client").Prisma.ConversationDelegate<import("@prisma/client/runtime/library").DefaultArgs>;
    get message(): import(".prisma/client").Prisma.MessageDelegate<import("@prisma/client/runtime/library").DefaultArgs>;
    get review(): import(".prisma/client").Prisma.ReviewDelegate<import("@prisma/client/runtime/library").DefaultArgs>;
    get chatSession(): import(".prisma/client").Prisma.ChatSessionDelegate<import("@prisma/client/runtime/library").DefaultArgs>;
    get adCampaign(): import(".prisma/client").Prisma.AdCampaignDelegate<import("@prisma/client/runtime/library").DefaultArgs>;
}
//# sourceMappingURL=prisma.service.d.ts.map