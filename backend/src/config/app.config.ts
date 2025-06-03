import { registerAs } from '@nestjs/config';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import validateConfig from '@/common/utils/validate-config';

enum Environment {
  Development = 'development',
  Production = 'production',
  Test = 'test',
}

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

class EnvironmentVariablesValidator {
  @IsString()
  @IsOptional()
  name: string;

  @IsString()
  @IsOptional()
  timezone: string;

  @IsEnum(Environment)
  @IsOptional()
  env: Environment;

  @IsString()
  @IsOptional()
  globalPrefix: string;
}

export default registerAs<AppConfig>('app', () => {
  validateConfig(process.env, EnvironmentVariablesValidator);

  return {
    name: process.env.APP_NAME ?? 'nestjs-mongodb-motorbike',
    timezone: process.env.APP_TIMEZONE || 'Asia/Ho_Chi_Minh',
    env: process.env.NODE_ENV || 'development',
    globalPrefix: process.env.GLOBAL_PREFIX || '/api',
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
