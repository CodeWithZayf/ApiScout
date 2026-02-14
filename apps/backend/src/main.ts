import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const corsOrigins = (process.env.CORS_ORIGIN ?? 'http://localhost:3000')
    .split(',')
    .map((o) => o.trim());

  app.enableCors({
    origin: corsOrigins.length === 1 ? corsOrigins[0] : corsOrigins,
    credentials: true,
  });

  app.setGlobalPrefix('api');

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  const port = process.env.PORT ?? 3001;
  await app.listen(port);

  console.log(`🚀 API running on http://localhost:${port}/api`);
}
bootstrap();
