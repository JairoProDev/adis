import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { ThrottlerModule } from '@nestjs/throttler';
import { join } from 'path';

// Modules
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { BusinessModule } from './modules/business/business.module';
import { ListingsModule } from './modules/listings/listings.module';
import { CategoriesModule } from './modules/categories/categories.module';
import { UploadsModule } from './modules/uploads/uploads.module';
import { EmailModule } from './modules/email/email.module';
import { PaymentsModule } from './modules/payments/payments.module';
import { ChatModule } from './modules/chat/chat.module';
import { AIModule } from './modules/ai/ai.module';
import { AnalyticsModule } from './modules/analytics/analytics.module';

// Services
import { PrismaService } from './common/services/prisma.service';

@Module({
  imports: [
    // Configuration
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env.local', '.env'],
    }),

    // GraphQL
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      sortSchema: true,
      playground: process.env.NODE_ENV !== 'production',
      introspection: true,
      context: ({ req, res }) => ({ req, res }),
      formatError: (error) => {
        // Log errors in development
        if (process.env.NODE_ENV !== 'production') {
          console.error('GraphQL Error:', error);
        }
        return error;
      },
    }),

    // Rate Limiting
    ThrottlerModule.forRoot([
      {
        ttl: parseInt(process.env.THROTTLE_TTL || '60'),
        limit: parseInt(process.env.THROTTLE_LIMIT || '100'),
      },
    ]),

    // Feature Modules
    AuthModule,
    UsersModule,
    BusinessModule,
    ListingsModule,
    CategoriesModule,
    UploadsModule,
    EmailModule,
    PaymentsModule,
    ChatModule,
    AIModule,
    AnalyticsModule,
  ],
  providers: [PrismaService],
  exports: [PrismaService],
})
export class AppModule {}
