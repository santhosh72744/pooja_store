import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import * as bodyParser from 'body-parser';
import { ConfigService } from '@nestjs/config';
import {join} from 'path';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    bodyParser: false,
  });

  const configService = app.get(ConfigService);

 
  app.use(
    '/payments/webhook',
    bodyParser.raw({ type: 'application/json' }),
  );

  
  app.use(bodyParser.json({ limit: '10mb' }));
  app.use(bodyParser.urlencoded({ extended: true, limit: '10mb' }));

  app.useStaticAssets(join(__dirname, '..', 'public'), {
  prefix: '/',
});

  const allowedOrigin =
    configService.get<string>('FRONTEND_URL') || '*';

  app.enableCors({
    origin: allowedOrigin,
    credentials: true,
  });


  app.set('trust proxy', 1);

  const port = configService.get<number>('PORT') || 3001;

  await app.listen(port);

  console.log(` Server running on port ${port}`);
}

bootstrap();
