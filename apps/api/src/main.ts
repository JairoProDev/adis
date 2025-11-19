import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ['error', 'warn', 'log', 'debug', 'verbose'],
  });

  const configService = app.get(ConfigService);
  const port = configService.get('PORT', 4000);

  // Enable CORS for all origins in development
  app.enableCors({
    origin:
      configService.get('NODE_ENV') === 'production'
        ? configService.get('ALLOWED_ORIGINS')?.split(',')
        : true,
    credentials: true,
  });

  // Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

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
