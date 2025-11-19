import { InputType, Field, ObjectType, Float, Int } from '@nestjs/graphql';
import { IsString, IsOptional, IsDateString, IsEnum, IsNotEmpty } from 'class-validator';

@InputType()
export class TrackPageViewInput {
  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  userId?: string;

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  businessId?: string;

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  listingId?: string;

  @Field()
  @IsString()
  @IsNotEmpty()
  tenantId: string;

  @Field()
  @IsString()
  @IsNotEmpty()
  ipAddress: string;

  @Field()
  @IsString()
  @IsNotEmpty()
  userAgent: string;

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  country?: string;

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  city?: string;

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  device?: string;

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  browser?: string;

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  referrer?: string;
}

@InputType()
export class AnalyticsQueryInput {
  @Field()
  @IsString()
  @IsNotEmpty()
  businessId: string;

  @Field()
  @IsDateString()
  startDate: string;

  @Field()
  @IsDateString()
  endDate: string;

  @Field({ nullable: true })
  @IsEnum(['day', 'week', 'month'])
  @IsOptional()
  interval?: 'day' | 'week' | 'month';
}

@InputType()
export class TenantAnalyticsQueryInput {
  @Field()
  @IsString()
  @IsNotEmpty()
  tenantId: string;

  @Field()
  @IsDateString()
  startDate: string;

  @Field()
  @IsDateString()
  endDate: string;
}

// Output Types

@ObjectType()
export class AnalyticsSummary {
  @Field(() => Int)
  totalViews: number;

  @Field(() => Int)
  totalClicks: number;

  @Field(() => Int)
  uniqueVisitors: number;

  @Field(() => Float)
  conversionRate: number;

  @Field(() => Float)
  avgSessionDuration: number;

  @Field(() => Float)
  bounceRate: number;
}

@ObjectType()
export class TimeSeriesDataPoint {
  @Field()
  date: string;

  @Field(() => Int)
  views: number;

  @Field(() => Int)
  clicks: number;

  @Field(() => Int)
  visitors: number;
}

@ObjectType()
export class GeographicDataPoint {
  @Field()
  country: string;

  @Field()
  city: string;

  @Field(() => Int)
  count: number;
}

@ObjectType()
export class DeviceDataPoint {
  @Field()
  device: string;

  @Field()
  browser: string;

  @Field(() => Int)
  count: number;
}

@ObjectType()
export class ReferrerDataPoint {
  @Field()
  referrer: string;

  @Field(() => Int)
  count: number;
}

@ObjectType()
export class TopPerformer {
  @Field()
  id: string;

  @Field()
  title: string;

  @Field()
  type: string;

  @Field(() => Int)
  views: number;

  @Field(() => Int)
  clicks: number;

  @Field(() => Float)
  conversionRate: number;
}

@ObjectType()
export class TenantAnalyticsSummary {
  @Field(() => Int)
  totalViews: number;

  @Field(() => Int)
  totalClicks: number;

  @Field(() => Int)
  uniqueVisitors: number;

  @Field(() => Float)
  conversionRate: number;

  @Field(() => Float)
  avgSessionDuration: number;

  @Field(() => Float)
  bounceRate: number;

  @Field(() => Int)
  totalBusinesses: number;

  @Field(() => Int)
  totalListings: number;
}
