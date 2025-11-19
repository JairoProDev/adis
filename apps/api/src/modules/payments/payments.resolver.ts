import { Resolver, Mutation, Args } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';
import { CurrentUser } from '@/common/decorators/current-user.decorator';

@Resolver()
export class PaymentsResolver {
  constructor(private paymentsService: PaymentsService) {}

  @Mutation('createCheckoutSession')
  @UseGuards(JwtAuthGuard)
  async createCheckoutSession(
    @CurrentUser() user: any,
    @Args('planId') planId: string,
    @Args('businessId', { nullable: true }) businessId?: string,
  ): Promise<string> {
    return this.paymentsService.createCheckoutSession(
      user.id,
      planId,
      businessId,
    );
  }

  @Mutation('cancelSubscription')
  @UseGuards(JwtAuthGuard)
  async cancelSubscription(
    @CurrentUser() user: any,
    @Args('subscriptionId') subscriptionId: string,
  ): Promise<boolean> {
    await this.paymentsService.cancelSubscription(user.id, subscriptionId);
    return true;
  }
}
