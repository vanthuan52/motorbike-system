import { registerAs } from '@nestjs/config';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { AppConfig } from './app-config.type';
import validateConfig from '@/common/utils/validate-config';

enum Environment {
  development = 'development',
  production = 'production',
  test = 'test',
}

class EnvironmentVariablesValidator {
  @IsString()
  @IsOptional()
  name: string;

  @IsString()
  @IsOptional()
  timezone: string;

  @IsEnum(Environment)
  @IsOptional()
  nodeEnv: Environment;

  @IsString()
  @IsOptional()
  apiPrefix: string;
}

export default registerAs<AppConfig>('app', () => {
  validateConfig(process.env, EnvironmentVariablesValidator);

  return {
    name: process.env.APP_NAME,
    timezone: process.env.APP_TIMEZONE || 'Asia/Ho_Chi_Minh',
    nodeEnv: process.env.NODE_ENV || 'development',
    apiPrefix: process.env.API_PREFIX || 'api',
    http: {
      host: process.env.HTTP_HOST,
      port: process.env.HTTP_PORT ? parseInt(process.env.HTTP_PORT, 10) : 5000,
    },
  } as AppConfig;
});
