import { InputType, Field } from '@nestjs/graphql';
import { IsString, IsOptional, IsNumber, IsObject, IsJSON } from 'class-validator';

@InputType()
export class CreateListingInput {
  @Field()
  @IsString()
  title: string;

  @Field()
  @IsString()
  description: string;

  @Field()
  @IsString()
  categoryId: string;

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  businessId?: string;

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  slug?: string;

  @Field({ nullable: true })
  @IsNumber()
  @IsOptional()
  price?: number;

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  priceType?: string;

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  currency?: string;

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  city?: string;

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  country?: string;

  @Field({ nullable: true })
  @IsObject()
  @IsOptional()
  metadata?: any; // JSONB field for category-specific data
}

@InputType()
export class UpdateListingInput {
  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  title?: string;

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  description?: string;

  @Field({ nullable: true })
  @IsNumber()
  @IsOptional()
  price?: number;

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  status?: string;

  @Field({ nullable: true })
  @IsObject()
  @IsOptional()
  metadata?: any;
}

@InputType()
export class ListingFilters {
  @Field({ nullable: true })
  categoryId?: string;

  @Field({ nullable: true })
  city?: string;

  @Field({ nullable: true })
  minPrice?: number;

  @Field({ nullable: true })
  maxPrice?: number;

  @Field({ nullable: true })
  query?: string;

  @Field({ nullable: true })
  sortBy?: string;

  @Field({ nullable: true })
  sortOrder?: 'asc' | 'desc';

  @Field({ nullable: true })
  skip?: number;

  @Field({ nullable: true })
  take?: number;
}
