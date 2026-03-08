import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // =========================
  // 🔹 Global Validation Pipe
  // =========================
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // strip properties not in DTO
      forbidNonWhitelisted: true, // throw error if extra fields
      transform: true, // auto-transform payloads to DTO classes
    }),
  );

  // =========================
  // 🔹 Swagger Setup
  // =========================
  const config = new DocumentBuilder()
    .setTitle('Notification & Auth API')
    .setDescription('API documentation for authentication and notifications')
    .setVersion('1.0')
    .addBearerAuth() // JWT Authorization
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document); // Swagger available at /api

  // =========================
  // 🔹 Start Application
  // =========================
  const port = process.env.PORT ?? 3000;
  await app.listen(port);
  console.log(`🚀 Application running on: http://localhost:${port}`);
  console.log(`📄 Swagger docs available at: http://localhost:${port}/api`);
}

void bootstrap();
