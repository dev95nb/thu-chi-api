import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import mongoose from 'mongoose';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const port = process.env.HTTP_PORT || 3000;
  app.enableCors();
  app.useGlobalPipes(
    new ValidationPipe({
      validateCustomDecorators: true,
    }),
  );

  const config = new DocumentBuilder()
    .setTitle('Sheeta API')
    .setDescription('Api of Sheeta App')
    .setVersion('1.0')
    .addBearerAuth({
      description: `Please enter token in following format: Bearer <JWT>`,
      name: 'Authorization',
      bearerFormat: 'Bearer',
      scheme: 'Bearer',
      type: 'http',
      in: 'Header',
    })
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs/api', app, document);

  if (process.env.NODE_ENV !== 'production') {
    mongoose.set('debug', true);
  }

  await app.listen(port);
}
bootstrap();
