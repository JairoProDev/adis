import { InputType, Field } from '@nestjs/graphql';
import { IsString, IsOptional, IsEmail, IsUrl } from 'class-validator';

@InputType()
export class CreateBusinessInput {
  @Field()
  @IsString()
  name: string;

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  slug?: string;

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  tagline?: string;

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  description?: string;

  @Field({ nullable: true })
  @IsEmail()
  @IsOptional()
  email?: string;

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  phone?: string;

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  whatsapp?: string;

  @Field({ nullable: true })
  @IsUrl()
  @IsOptional()
  website?: string;

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  address?: string;

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  city?: string;

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  country?: string;
}

@InputType()
export class UpdateBusinessInput {
  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  name?: string;

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  tagline?: string;

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  description?: string;

  @Field({ nullable: true })
  @IsEmail()
  @IsOptional()
  email?: string;

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  phone?: string;

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  logo?: string;

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  coverImage?: string;
}

@InputType()
export class UpdatePageConfigInput {
  @Field()
  @IsString()
  businessId: string;

  @Field()
  theme: any; // JSON field for page configuration
}
