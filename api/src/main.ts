import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import cookieParser from 'cookie-parser';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const websiteOrigin = process.env.WEBSITE_ORIGIN || 'http://localhost:33001';
  const adminOrigin = process.env.ADMIN_ORIGIN || 'http://localhost:33002';

  app.use(cookieParser());
  app.enableCors({
    origin: [websiteOrigin, adminOrigin],
    credentials: true,
  });
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );

  const port = Number(process.env.API_PORT || process.env.PORT || 33000);
  await app.listen(port);
  console.log(`API listening on http://localhost:${port}`);
}
void bootstrap();
