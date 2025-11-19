import { Resolver, Query, Mutation, Args, ID } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserInput } from './dto/update-user.input';
import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';
import { CurrentUser } from '@/common/decorators/current-user.decorator';

@Resolver('User')
export class UsersResolver {
  constructor(private usersService: UsersService) {}

  @Query('users')
  @UseGuards(JwtAuthGuard)
  async findAll(
    @CurrentUser() user: any,
    @Args('skip', { nullable: true }) skip?: number,
    @Args('take', { nullable: true }) take?: number,
  ) {
    return this.usersService.findAll(user.tenantId, skip, take);
  }

  @Query('user')
  @UseGuards(JwtAuthGuard)
  async findOne(@Args('id', { type: () => ID }) id: string) {
    return this.usersService.findOne(id);
  }

  @Query('me')
  @UseGuards(JwtAuthGuard)
  async me(@CurrentUser() user: any) {
    return this.usersService.findOne(user.id);
  }

  @Mutation('updateUser')
  @UseGuards(JwtAuthGuard)
  async update(
    @CurrentUser() user: any,
    @Args('id', { type: () => ID }) id: string,
    @Args('input') input: UpdateUserInput,
  ) {
    // Users can only update their own profile (unless admin)
    if (user.id !== id && user.role !== 'SUPER_ADMIN') {
      throw new Error('Unauthorized');
    }

    return this.usersService.update(id, input);
  }

  @Mutation('deleteUser')
  @UseGuards(JwtAuthGuard)
  async delete(
    @CurrentUser() user: any,
    @Args('id', { type: () => ID }) id: string,
  ) {
    // Users can only delete their own account (unless admin)
    if (user.id !== id && user.role !== 'SUPER_ADMIN') {
      throw new Error('Unauthorized');
    }

    return this.usersService.delete(id);
  }
}
