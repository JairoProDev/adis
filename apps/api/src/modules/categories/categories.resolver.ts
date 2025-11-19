import { Resolver, Query, Args } from '@nestjs/graphql';
import { CategoriesService } from './categories.service';

@Resolver('Category')
export class CategoriesResolver {
  constructor(private categoriesService: CategoriesService) {}

  @Query('categories')
  async findAll() {
    return this.categoriesService.findAll();
  }

  @Query('category')
  async findOne(@Args('slug') slug: string) {
    return this.categoriesService.findOne(slug);
  }
}
