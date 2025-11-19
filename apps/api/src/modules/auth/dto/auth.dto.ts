import { InputType, Field, ObjectType } from '@nestjs/graphql';
import { IsEmail, IsString, MinLength, IsOptional } from 'class-validator';

@InputType()
export class SignupInput {
  @Field()
  @IsEmail()
  email: string;

  @Field()
  @IsString()
  @MinLength(8)
  password: string;

  @Field()
  @IsString()
  firstName: string;

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  lastName?: string;

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  phone?: string;

  // Attribution fields
  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  acquiredBy?: string;

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  acquiredVia?: string;

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  acquiredFrom?: string;
}

@InputType()
export class LoginInput {
  @Field()
  @IsEmail()
  email: string;

  @Field()
  @IsString()
  password: string;
}

@ObjectType()
export class UserPayload {
  @Field()
  id: string;

  @Field()
  email: string;

  @Field({ nullable: true })
  firstName?: string;

  @Field({ nullable: true })
  lastName?: string;

  @Field()
  role: string;
}

@ObjectType()
export class AuthResponse {
  @Field()
  accessToken: string;

  @Field(() => UserPayload)
  user: UserPayload;
}
