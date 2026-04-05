import { registerAs } from '@nestjs/config';
import { author, repository, version } from 'package.json';
import { EnumAppEnvironment } from '@/app/enums/app.enum';

export type AppConfig = {
  name: string;
  env: string;
  timezone: string;

  version: string;
  encryptionSecretKey: string;
  author: {
    name: string;
    email: string;
  };
  url: string;
  globalPrefix: string;
  http: {
    host: string;
    port: number;
  };
  urlVersion: {
    enable: boolean;
    prefix: string;
    version: string;
  };
};

export default registerAs<AppConfig>('app', (): AppConfig => {
  return {
    name: process.env.APP_NAME ?? 'nestjs-motorbike-system',
    env:
      EnumAppEnvironment[process.env.APP_ENV] ?? EnumAppEnvironment.development,
    timezone: process.env.APP_TIMEZONE || 'Asia/Ho_Chi_Minh',
    version,
    encryptionSecretKey: process.env.APP_ENCRYPTION_SECRET_KEY,
    author: author as {
      name: string;
      email: string;
    },
    url: repository.url,
    globalPrefix: '/api',

    http: {
      host: process.env.HTTP_HOST ?? 'localhost',
      port: process.env.HTTP_PORT ? +process.env.HTTP_PORT : 3500,
    },
    urlVersion: {
      enable: process.env.URL_VERSIONING_ENABLE === 'true',
      prefix: 'v',
      version: process.env.URL_VERSION ?? '1',
    },
  } as AppConfig;
});
