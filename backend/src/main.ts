import { NestApplication, NestFactory } from '@nestjs/core';
import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app.module';
import { AllConfigType } from './config/config.type';
import { GlobalExceptionFilter } from './app/filters/global-exception.filter';
import { CustomValidationPipe } from './app/pipes/custom-validation.pipe';
import swaggerInit from '@/swagger';
import { UserSeedService } from './common/database/seeders/user/user-seed.service';

async function bootstrap() {
  const app: NestApplication = await NestFactory.create(AppModule, {
    abortOnError: true,
    bufferLogs: false,
  });
  const configService = app.get(ConfigService<AllConfigType>);
  const databaseUri: string = configService.getOrThrow('database.url', {
    infer: true,
  });

  const logger = new Logger('NestJs-Main');

  app.enableShutdownHooks();
  app.setGlobalPrefix(
    configService.getOrThrow('app.apiPrefix', { infer: true }),
    {
      exclude: ['/'],
    },
  );

  app.useGlobalFilters(new GlobalExceptionFilter());
  app.useGlobalPipes(new CustomValidationPipe());

  // Swagger
  await swaggerInit(app);

  // Running seed
  const userSeedService = app.get(UserSeedService);
  await userSeedService.run();

  await app.listen(configService.getOrThrow('app.http.port', { infer: true }));

  logger.log(`Http Server running on ${await app.getUrl()}`, 'NestApplication');
  logger.log(`Database uri ${databaseUri}`);
}
bootstrap();
