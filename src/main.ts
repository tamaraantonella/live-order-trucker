import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(3000).then(
    () => console.log(`Application is running on: http://localhost:3000`),
    (error) => console.error('Error starting the application:', error),
  );
}

bootstrap();
