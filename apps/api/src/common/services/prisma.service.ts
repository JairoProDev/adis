import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { prisma } from '@publicadis/database';

@Injectable()
export class PrismaService implements OnModuleInit, OnModuleDestroy {
  // Use the singleton from @publicadis/database
  private client = prisma;

  async onModuleInit() {
    await this.client.$connect();
    console.log('✅ Database connected');
  }

  async onModuleDestroy() {
    await this.client.$disconnect();
  }

  // Expose all Prisma client methods
  get user() {
    return this.client.user;
  }

  get business() {
    return this.client.business;
  }

  get listing() {
    return this.client.listing;
  }

  get category() {
    return this.client.category;
  }

  get tenant() {
    return this.client.tenant;
  }

  get subscription() {
    return this.client.subscription;
  }

  get transaction() {
    return this.client.transaction;
  }

  get conversation() {
    return this.client.conversation;
  }

  get message() {
    return this.client.message;
  }

  get review() {
    return this.client.review;
  }

  get chatSession() {
    return this.client.chatSession;
  }

  get adCampaign() {
    return this.client.adCampaign;
  }

  // ... expose other models as needed
}
