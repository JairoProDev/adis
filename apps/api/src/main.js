"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const app_module_1 = require("./app.module");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule, {
        logger: ['error', 'warn', 'log', 'debug', 'verbose'],
    });
    const configService = app.get(config_1.ConfigService);
    const port = configService.get('PORT', 4000);
    // Enable CORS for all origins in development
    app.enableCors({
        origin: configService.get('NODE_ENV') === 'production'
            ? configService.get('ALLOWED_ORIGINS')?.split(',')
            : true,
        credentials: true,
    });
    // Global validation pipe
    app.useGlobalPipes(new common_1.ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
        transformOptions: {
            enableImplicitConversion: true,
        },
    }));
    // Global prefix
    app.setGlobalPrefix('api');
    await app.listen(port);
    console.log(`
    🚀 PUBLICADIS API is running!

    📡 GraphQL Playground: http://localhost:${port}/graphql
    🔗 REST API: http://localhost:${port}/api
    🌍 Environment: ${configService.get('NODE_ENV')}
  `);
}
bootstrap();
//# sourceMappingURL=main.js.map