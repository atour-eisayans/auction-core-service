import { join } from 'node:path';
import { promises as fs } from 'node:fs';
import { name, description, version } from '../package.json';
import { AppModule } from '../src/app.module';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

const createSwaggerDocumentation = async (): Promise<void> => {
  const outdir = join(__dirname, 'swagger.json');

  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
  );
  const options = new DocumentBuilder()
    .setTitle(name)
    .setDescription(description)
    .setVersion(version)
    .build();
  const document = SwaggerModule.createDocument(app, options);

  await fs.writeFile(outdir, JSON.stringify(document, null, 4));
  await app.close();
};

createSwaggerDocumentation().catch((error: Error) => {
  console.log(error);
});
