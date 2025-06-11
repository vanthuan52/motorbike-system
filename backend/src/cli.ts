import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { CommandModule, CommandService } from 'nestjs-command';
import { MigrationModule } from './migration/migration.module';
import { ENUM_NODE_ENVIRONMENT } from '@/app/enums/app.enum';

async function bootstrap() {
  process.env.NODE_ENV = ENUM_NODE_ENVIRONMENT.MIGRATION;

  const app = await NestFactory.createApplicationContext(MigrationModule, {
    logger: ['error', 'fatal'],
    abortOnError: true,
    bufferLogs: false,
  });

  const logger = new Logger('NestJs-seed');

  try {
    await app.select(CommandModule).get(CommandService).exec();
    process.exit(0);
  } catch (err: unknown) {
    logger.error(err);

    process.exit(1);
  }
}

bootstrap();
