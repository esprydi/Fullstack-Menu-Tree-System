import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { AllExceptionsFilter } from './common/filters/http-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Semua route akan diawali dengan /api (misal: /api/menus)
  app.setGlobalPrefix('api');
  
  // Mengaktifkan validasi otomatis dari class-validator
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));

  // Mengaktifkan filter error global
  app.useGlobalFilters(new AllExceptionsFilter());

  // Konfigurasi Swagger
  const config = new DocumentBuilder()
    .setTitle('Menu Tree System API')
    .setDescription('The API documentation for the Fullstack Menu Tree System')
    .setVersion('1.0')
    .addTag('Menus')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  // Enable CORS
  app.enableCors();
  
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
