import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // ✅ IMPORTANT: allow frontend (3000) to talk to backend (3001)
  app.enableCors({
    origin: true,
    credentials: true,
  });

  // optional: global prefix (clean APIs)
  app.setGlobalPrefix('');

  await app.listen(process.env.PORT || 3001);

  console.log(`🚀 Backend running on http://localhost:${process.env.PORT || 3001}`);
}

bootstrap();
