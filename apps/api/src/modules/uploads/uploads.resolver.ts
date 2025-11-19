import { Resolver, Mutation, Args } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { UploadsService } from './uploads.service';
import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';
import { CurrentUser } from '@/common/decorators/current-user.decorator';

@Resolver()
export class UploadsResolver {
  constructor(private uploadsService: UploadsService) {}

  @Mutation('getUploadUrl')
  @UseGuards(JwtAuthGuard)
  async getUploadUrl(
    @Args('filename') filename: string,
    @Args('contentType') contentType: string,
  ): Promise<string> {
    return this.uploadsService.getUploadUrl(filename, contentType);
  }
}
