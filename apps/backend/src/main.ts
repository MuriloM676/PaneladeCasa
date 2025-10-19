import { NestFactory } from '@nestjs/core';
import { AppModule } from './modules/app.module';
import { ValidationPipe } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.setGlobalPrefix('api');
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }));
  // Configure CORS from env (comma-separated). Defaults to localhost. Use '*' to allow all in emergencies only.
  const corsEnv = process.env.CORS_ORIGIN?.trim();
  let corsOrigin: any = ['http://localhost:3000'];
  if (corsEnv) {
    if (corsEnv === '*') {
      corsOrigin = true; // reflect request origin (Access-Control-Allow-Origin)
    } else {
      corsOrigin = corsEnv.split(',').map((o) => o.trim()).filter(Boolean);
    }
  }
  app.enableCors({ origin: corsOrigin, credentials: true });
  
  // Servir arquivos estáticos da pasta uploads
  app.useStaticAssets(join(__dirname, '..', '..', 'uploads'), {
    prefix: '/uploads/',
  });
  
  const port = process.env.PORT || 3001;
  await app.listen(port);
  console.log(`Backend running on http://localhost:${port}`);
}
bootstrap();
