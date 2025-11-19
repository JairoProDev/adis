import { Resolver, Query, Mutation, Args, ID } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { ListingsService } from './listings.service';
import { CreateListingInput, UpdateListingInput, ListingFilters } from './dto/listing.input';
import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';
import { CurrentUser } from '@/common/decorators/current-user.decorator';

@Resolver('Listing')
export class ListingsResolver {
  constructor(private listingsService: ListingsService) {}

  @Mutation('createListing')
  @UseGuards(JwtAuthGuard)
  async create(
    @CurrentUser() user: any,
    @Args('input') input: CreateListingInput,
  ) {
    return this.listingsService.create(user.id, user.tenantId, input);
  }

  @Query('listings')
  async findAll(
    @Args('tenantId', { defaultValue: 'publicadis' }) tenantId: string,
    @Args('filters', { nullable: true }) filters?: ListingFilters,
  ) {
    return this.listingsService.findAll(tenantId, filters);
  }

  @Query('listing')
  async findOne(@Args('slug') slug: string) {
    return this.listingsService.findOne(slug);
  }

  @Mutation('updateListing')
  @UseGuards(JwtAuthGuard)
  async update(
    @CurrentUser() user: any,
    @Args('id', { type: () => ID }) id: string,
    @Args('input') input: UpdateListingInput,
  ) {
    return this.listingsService.update(user.id, id, input);
  }

  @Mutation('deleteListing')
  @UseGuards(JwtAuthGuard)
  async delete(
    @CurrentUser() user: any,
    @Args('id', { type: () => ID }) id: string,
  ) {
    return this.listingsService.delete(user.id, id);
  }
}
