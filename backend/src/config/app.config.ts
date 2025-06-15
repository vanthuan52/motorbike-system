import { registerAs } from '@nestjs/config';

export type AppConfig = {
  name: string;
  timezone: string;
  env: string;
  globalPrefix: string;
  versioning: {
    enable: boolean;
    prefix: string;
    version: string;
  };
  http: {
    host: string;
    port: string | number;
  };
  jobEnable: boolean;
};

export default registerAs<AppConfig>('app', () => {
  return {
    name: process.env.APP_NAME ?? 'nestjs-mongodb-motorbike',
    timezone: process.env.APP_TIMEZONE || 'Asia/Ho_Chi_Minh',
    env: process.env.NODE_ENV || 'development',
    globalPrefix: process.env.GLOBAL_PREFIX,
    versioning: {
      enable: process.env.URL_VERSIONING_ENABLE === 'true',
      prefix: 'v',
      version: process.env.URL_VERSION ?? '1',
    },
    http: {
      host: process.env.HTTP_HOST ?? 'localhost',
      port: process.env.HTTP_PORT ? parseInt(process.env.HTTP_PORT, 10) : 5000,
    },
    jobEnable: process.env.JOB_ENABLE === 'true',
  } as AppConfig;
});
