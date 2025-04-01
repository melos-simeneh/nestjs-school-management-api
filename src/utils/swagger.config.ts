import { DocumentBuilder } from '@nestjs/swagger';

export const swaggerConfig = new DocumentBuilder()
  .setTitle('School Management API')
  .setDescription('API for managing schools and sorting them by proximity')
  .setVersion('1.0')
  .addTag('schools')
  .build();
