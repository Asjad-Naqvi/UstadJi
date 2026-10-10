import { NestFactory } from "@nestjs/core";
import { ValidationPipe, Logger } from "@nestjs/common";
import { AppModule } from "./app.module";

async function bootstrap() {
  const logger = new Logger("UstadJi-Bootstrap");
  const app = await NestFactory.create(AppModule);

  // Enable CORS for mobile app and web frontend
  app.enableCors({
    origin: "*",
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS",
    credentials: true,
  });

  // Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: false,
    })
  );

  const port = process.env.PORT || 4000;
  await app.listen(port);

  logger.log(`🚀 UstadJi Core Backend is running on: http://localhost:${port}`);
  logger.log(`📦 Module 5 (Booking & Scheduling) active with real-time slot locks & 30-min timers.`);
}

bootstrap();
