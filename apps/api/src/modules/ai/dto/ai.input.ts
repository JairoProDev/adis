import { InputType, Field, ObjectType, Float, Int } from '@nestjs/graphql';
import { IsString, IsNotEmpty, IsOptional, IsArray, IsNumber, MinLength } from 'class-validator';

// Input Types

@InputType()
export class ConversationMessageInput {
  @Field()
  @IsString()
  role: string; // 'user' | 'assistant'

  @Field()
  @IsString()
  content: string;
}

@InputType()
export class ChatInput {
  @Field()
  @IsString()
  @IsNotEmpty()
  businessId: string;

  @Field()
  @IsString()
  @IsNotEmpty()
  @MinLength(1)
  message: string;

  @Field(() => [ConversationMessageInput], { nullable: true })
  @IsArray()
  @IsOptional()
  conversationHistory?: ConversationMessageInput[];
}

@InputType()
export class GenerateDescriptionInput {
  @Field()
  @IsString()
  @IsNotEmpty()
  businessName: string;

  @Field()
  @IsString()
  @IsNotEmpty()
  category: string;

  @Field(() => [String], { nullable: true })
  @IsArray()
  @IsOptional()
  keywords?: string[];
}

@InputType()
export class GenerateListingDescriptionInput {
  @Field()
  @IsString()
  @IsNotEmpty()
  title: string;

  @Field()
  @IsString()
  @IsNotEmpty()
  category: string;

  @Field(() => Float, { nullable: true })
  @IsNumber()
  @IsOptional()
  price?: number;

  @Field(() => [String], { nullable: true })
  @IsArray()
  @IsOptional()
  features?: string[];
}

@InputType()
export class AddKnowledgeBaseInput {
  @Field()
  @IsString()
  @IsNotEmpty()
  businessId: string;

  @Field()
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  question: string;

  @Field()
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  answer: string;

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  category?: string;
}

@InputType()
export class SearchKnowledgeBaseInput {
  @Field()
  @IsString()
  @IsNotEmpty()
  businessId: string;

  @Field()
  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  query: string;

  @Field(() => Int, { nullable: true })
  @IsNumber()
  @IsOptional()
  limit?: number;
}

@InputType()
export class AutoGenerateKBInput {
  @Field()
  @IsString()
  @IsNotEmpty()
  businessId: string;
}

@InputType()
export class SuggestKBInput {
  @Field()
  @IsString()
  @IsNotEmpty()
  businessName: string;

  @Field()
  @IsString()
  @IsNotEmpty()
  description: string;

  @Field()
  @IsString()
  @IsNotEmpty()
  category: string;
}

// Output Types

@ObjectType()
export class SearchResult {
  @Field()
  id: string;

  @Field()
  question: string;

  @Field()
  answer: string;

  @Field(() => Float)
  score: number;
}

@ObjectType()
export class KnowledgeBaseSuggestion {
  @Field()
  question: string;

  @Field()
  answer: string;

  @Field()
  category: string;
}
