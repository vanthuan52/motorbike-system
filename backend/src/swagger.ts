import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestApplication } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { writeFileSync } from 'fs';
import { ENUM_APP_ENVIRONMENT } from '@/app/enums/app.enum';
import { AllConfigType } from './config/config.type';

export default async function (app: NestApplication) {
  const configService = app.get(ConfigService<AllConfigType>);
  const logger = new Logger('NestJs-Swagger');

  const env: string = configService.getOrThrow<string>('app.env', {
    infer: true,
  });
  const docName = configService.getOrThrow<string>('docs.name', {
    infer: true,
  });
  const docDesc = configService.getOrThrow<string>('docs.description', {
    infer: true,
  });
  const docPrefix = configService.getOrThrow<string>('docs.prefix', {
    infer: true,
  });

  if (env !== ENUM_APP_ENVIRONMENT.PRODUCTION) {
    const documentBuild = new DocumentBuilder()
      .setTitle(docName)
      .setDescription(docDesc)
      .addServer('/')
      .addServer('/staging')
      .addServer('/prod')
      .addBearerAuth(
        { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
        'accessToken',
      )
      .addBearerAuth(
        { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
        'refreshToken',
      )
      .build();

    const document = SwaggerModule.createDocument(app, documentBuild, {
      deepScanRoutes: true,
    });

    writeFileSync('./data/swagger.json', JSON.stringify(document));

    SwaggerModule.setup(docPrefix, app, document, {
      jsonDocumentUrl: `${docPrefix}/json`,
      yamlDocumentUrl: `${docPrefix}/yaml`,
      explorer: true,
      customSiteTitle: docName,
      swaggerOptions: {
        docExpansion: 'none',
        persistAuthorization: true,
        displayOperationId: true,
        operationsSorter: 'method',
        tagsSorter: 'alpha',
        tryItOutEnabled: true,
        filter: true,
        deepLinking: true,
      },
    });

    logger.log(`Docs will serve on ${docPrefix}`, 'NestApplication');
  }
}
