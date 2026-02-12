"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const graphql_1 = require("@nestjs/graphql");
const apollo_1 = require("@nestjs/apollo");
const throttler_1 = require("@nestjs/throttler");
const path_1 = require("path");
// Modules
const auth_module_1 = require("./modules/auth/auth.module");
const users_module_1 = require("./modules/users/users.module");
const business_module_1 = require("./modules/business/business.module");
const listings_module_1 = require("./modules/listings/listings.module");
const categories_module_1 = require("./modules/categories/categories.module");
const uploads_module_1 = require("./modules/uploads/uploads.module");
const email_module_1 = require("./modules/email/email.module");
const payments_module_1 = require("./modules/payments/payments.module");
const chat_module_1 = require("./modules/chat/chat.module");
const ai_module_1 = require("./modules/ai/ai.module");
const analytics_module_1 = require("./modules/analytics/analytics.module");
// Services
const prisma_service_1 = require("./common/services/prisma.service");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            // Configuration
            config_1.ConfigModule.forRoot({
                isGlobal: true,
                envFilePath: ['.env.local', '.env'],
            }),
            // GraphQL
            graphql_1.GraphQLModule.forRoot({
                driver: apollo_1.ApolloDriver,
                autoSchemaFile: (0, path_1.join)(process.cwd(), 'src/schema.gql'),
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
            throttler_1.ThrottlerModule.forRoot([
                {
                    ttl: parseInt(process.env.THROTTLE_TTL || '60'),
                    limit: parseInt(process.env.THROTTLE_LIMIT || '100'),
                },
            ]),
            // Feature Modules
            auth_module_1.AuthModule,
            users_module_1.UsersModule,
            business_module_1.BusinessModule,
            listings_module_1.ListingsModule,
            categories_module_1.CategoriesModule,
            uploads_module_1.UploadsModule,
            email_module_1.EmailModule,
            payments_module_1.PaymentsModule,
            chat_module_1.ChatModule,
            ai_module_1.AIModule,
            analytics_module_1.AnalyticsModule,
        ],
        providers: [prisma_service_1.PrismaService],
        exports: [prisma_service_1.PrismaService],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map