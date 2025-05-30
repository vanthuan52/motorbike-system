import { HttpAdapterHost, NestApplication, NestFactory } from '@nestjs/core';
import { Logger, VersioningType } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NextFunction } from 'express';
import { plainToInstance } from 'class-transformer';
import { useContainer, validate } from 'class-validator';
import { Logger as PinoLogger } from 'nestjs-pino';
import compression from 'compression';
import { AppModule } from './app/app.module';
import { AllConfigType } from './config/config.type';
import { GlobalExceptionFilter } from './app/filters/global-exception.filter';
import { CustomValidationPipe } from './app/pipes/custom-validation.pipe';
import swaggerInit from '@/swagger';
import { AllExceptionsFilter } from './app/filters/all-exeptions.filter';
import { MessageService } from './common/message/services/message.service';
import { AppEnvDto } from './app/dtos/app.env.dto';

async function bootstrap() {
  const app: NestApplication = await NestFactory.create(AppModule, {
    abortOnError: true,
    bufferLogs: false,
  });
  const configService = app.get(ConfigService<AllConfigType>);
  const httpAdapterHost = app.get(HttpAdapterHost);

  const env: string = configService.getOrThrow<string>('app.env', {
    infer: true,
  });
  const timezone: string = configService.getOrThrow<string>('app.timezone', {
    infer: true,
  });
  const host: string = configService.getOrThrow<string>('app.http.host', {
    infer: true,
  });
  const port: number = configService.getOrThrow<number>('app.http.port', {
    infer: true,
  });
  const globalPrefix: string = configService.getOrThrow<string>(
    'app.globalPrefix',
    { infer: true },
  );
  const versioningPrefix: string = configService.getOrThrow<string>(
    'app.versioning.prefix',
    { infer: true },
  );
  const version: string = configService.getOrThrow<string>(
    'app.versioning.version',
    { infer: true },
  );
  const versionEnable: boolean = configService.getOrThrow<boolean>(
    'app.versioning.enable',
    { infer: true },
  );

  const logger = new Logger('NestJs-Main');
  process.env.NODE_ENV = env;
  process.env.TZ = timezone;

  // logger
  app.useLogger(app.get(PinoLogger));

  // Compression
  app.use(compression());

  app.enableShutdownHooks();
  app.setGlobalPrefix(globalPrefix);

  app.useGlobalFilters(
    new GlobalExceptionFilter(),
    new AllExceptionsFilter(httpAdapterHost),
  );
  app.useGlobalPipes(new CustomValidationPipe());

  // For Custom Validation
  useContainer(app.select(AppModule), { fallbackOnErrors: true });

  // Versioning
  if (versionEnable) {
    app.enableVersioning({
      type: VersioningType.URI,
      defaultVersion: version,
      prefix: versioningPrefix,
    });
  }

  // Validate Env
  const classEnv = plainToInstance(AppEnvDto, process.env);
  const errors = await validate(classEnv);
  if (errors.length > 0) {
    const messageService = app.get(MessageService);
    const errorsMessage = messageService.setValidationMessage(errors);

    throw new Error('Env Variable Invalid', {
      cause: errorsMessage,
    });
  }
  // Swagger
  await swaggerInit(app);

  // set response for log
  app.use(function (_: Request, res: any, next: NextFunction) {
    const send = res.send;
    res.send = function (body: any) {
      res.body = body;
      send.call(this, body);
    };
    next();
  });

  await app.listen(port, host);

  logger.log(`Http versioning is ${version}`);

  logger.log(`Http Server running on ${await app.getUrl()}`, 'NestApplication');

  return;
}
bootstrap();
