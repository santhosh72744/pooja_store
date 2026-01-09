import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import * as bodyParser from 'body-parser';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    bodyParser: false, 
  });

  
  app.use(
    '/payments/webhook',
    bodyParser.raw({ type: 'application/json' }),
  );

  // ✅ Normal body parsing for all other routes
  app.use(bodyParser.json({ limit: '10mb' }));
  app.use(bodyParser.urlencoded({ extended: true }));

  
  app.enableCors({
    origin: 'http://localhost:3000',
    credentials: true,
  });

  const port = 3001;
  await app.listen(port);

  console.log(`Nest app listening on port ${port}`);
}

bootstrap();
