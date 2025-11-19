import { Resolver, Query, Mutation, Args, ID } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { BusinessService } from './business.service';
import { CreateBusinessInput, UpdateBusinessInput } from './dto/business.input';
import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';
import { CurrentUser } from '@/common/decorators/current-user.decorator';

@Resolver('Business')
export class BusinessResolver {
  constructor(private businessService: BusinessService) {}

  @Mutation('createBusiness')
  @UseGuards(JwtAuthGuard)
  async create(
    @CurrentUser() user: any,
    @Args('input') input: CreateBusinessInput,
  ) {
    return this.businessService.create(user.id, user.tenantId, input);
  }

  @Query('businesses')
  async findAll(
    @Args('tenantId', { defaultValue: 'publicadis' }) tenantId: string,
    @Args('city', { nullable: true }) city?: string,
  ) {
    const filters = city ? { city } : {};
    return this.businessService.findAll(tenantId, filters);
  }

  @Query('business')
  async findOne(@Args('slug') slug: string) {
    return this.businessService.findOne(slug);
  }

  @Mutation('updateBusiness')
  @UseGuards(JwtAuthGuard)
  async update(
    @CurrentUser() user: any,
    @Args('id', { type: () => ID }) id: string,
    @Args('input') input: UpdateBusinessInput,
  ) {
    return this.businessService.update(user.id, id, input);
  }

  @Mutation('deleteBusiness')
  @UseGuards(JwtAuthGuard)
  async delete(
    @CurrentUser() user: any,
    @Args('id', { type: () => ID }) id: string,
  ) {
    return this.businessService.delete(user.id, id);
  }
}
