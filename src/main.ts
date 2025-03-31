import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle('School Management API')
    .setDescription('API for managing schools and sorting them by proximity')
    .setVersion('1.0')
    .addTag('schools')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  const port = process.env.PORT ?? 5000;
  await app.listen(port, () => {
    console.log(`School API is running on port ${port}`);
  });
}
bootstrap();
