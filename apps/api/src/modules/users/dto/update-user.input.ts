import { InputType, Field } from '@nestjs/graphql';
import { IsString, IsOptional, IsEmail } from 'class-validator';

@InputType()
export class UpdateUserInput {
  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  firstName?: string;

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  lastName?: string;

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
  avatar?: string;

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  bio?: string;
}
