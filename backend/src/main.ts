import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { GlobalExceptionFilter } from './common/filters/global-exception.filter';
import { ResponseInterceptor } from './common/interceptors/response.interceptor';
import { ConfigService } from '@nestjs/config';
import helmet from 'helmet';
import * as express from 'express';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { Logger } from 'nestjs-pino';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bufferLogs: true,
  });

  const config = new DocumentBuilder()
    .setTitle('ShopSphere API')
    .setDescription(
      'Production-ready eCommerce API built with NestJS',
    )
    .setVersion('1.0')
    .addBearerAuth()
    .build();


  const document =
    SwaggerModule.createDocument(
      app,
      config,
    );


  SwaggerModule.setup(
    'api/docs',
    app,
    document,
  );

  app.use(helmet());

  const configService =
    app.get(ConfigService);

  app.useGlobalFilters(
    new GlobalExceptionFilter(),
  );

  app.useGlobalInterceptors(
    new ResponseInterceptor(),
  );

  app.enableCors({
    origin: configService.get<string>('app.corsOrigin'),
    methods: configService.get<string>('httpMethods'),
    credentials: true,
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // Payload Size Limit
  app.use(
    express.json({
      limit: '1mb',
    }),
  );

  app.use(
    express.urlencoded({
      extended: true,
      limit: '1mb',
    }),
  );

  app.useLogger(app.get(Logger));

  // Application Port
  const port =
    configService.get<number>(
      'app.port',
    );
  await app.listen(port ?? 3000);
}
void bootstrap();
