import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe, VersioningType } from '@nestjs/common';
import { JwtAuthGuard } from './auth/jwt-auth.guard';
import { TransformInterceptor } from './core/transform.interceptor';
import cookieParser from 'cookie-parser';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import helmet from 'helmet';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
require('dotenv').config()
async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  // khai báo để dùng jwt toàn cục 

  app.useStaticAssets(join(__dirname, '..', 'public'));
  app.setBaseViewsDir(join(__dirname, '..', 'views'));

  const reflector = app.get(Reflector)
  app.useGlobalGuards(new JwtAuthGuard(reflector))

  app.use(cookieParser());

  app.useGlobalPipes(new ValidationPipe(

  ));// khai báo global để dùng được mọi nơi
  //fix CORS
  app.enableCors({
    "origin": true,
    "methods": "GET,HEAD,PUT,PATCH,POST,DELETE",
    "preflightContinue": false,
    credentials: true
  });
  //tranform respone data to client
  app.useGlobalInterceptors(new TransformInterceptor(reflector));
  //config version
  app.setGlobalPrefix('api'); // thêm tiền tố global
  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: ['1', '2']// tiền tố
  });
  //config helmet
  app.use(helmet());
  //config swagger
  const config = new DocumentBuilder()
    .setTitle('Project IT')
    .setDescription('API description')
    .setVersion('1.0')
    .addTag('IT')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'Bearer',
        bearerFormat: 'JWT',
        in: 'header',
      },
      'token',

    )
    .addSecurityRequirements('token')
    .build()
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document,
    {
      swaggerOptions: {
        persistAuthorization: true,
      }
    }
  );

  await app.listen(process.env.PORT);
}
bootstrap();

