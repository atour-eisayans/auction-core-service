import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { validationPipeConfig } from './shared/validation/validation-pipe.config';
import {
  NestFastifyApplication,
  FastifyAdapter,
} from '@nestjs/platform-fastify';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

const setupSwaggerDocs = (app: NestFastifyApplication) => {
  const config = new DocumentBuilder()
    .setTitle('Super Auction')
    .setDescription('The auction API description')
    .addTag('super-auction')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
};

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
  );
  setupSwaggerDocs(app);
  app.useGlobalPipes(new ValidationPipe(validationPipeConfig));
  await app.listen(3000);
}

bootstrap();
