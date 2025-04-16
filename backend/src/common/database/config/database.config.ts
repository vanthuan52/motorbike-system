import { registerAs } from '@nestjs/config';
import { IsOptional, IsString } from 'class-validator';
import validateConfig from '@/common/utils/validate-config';
import { DatabaseConfig } from './database-config.type';

class EnvironmentVariablesValidator {
  @IsString()
  @IsOptional()
  url: string;

  @IsString()
  @IsOptional()
  name: string;

  @IsString()
  @IsOptional()
  username: string;

  @IsString()
  @IsOptional()
  password: string;

  @IsString()
  @IsOptional()
  debug: string;
}

export default registerAs<DatabaseConfig>('database', () => {
  validateConfig(process.env, EnvironmentVariablesValidator);

  return {
    url: process.env.DATABASE_URL,
    name: process.env.DATABASE_NAME,
    username: process.env.DATABASE_USERNAME,
    password: process.env.DATABASE_PASSWORD,
    debug: process.env.DATABASE_DEBUG === 'true',
    timeoutOptions: {
      serverSelectionTimeoutMS: 30 * 1000, // 30 secs
      socketTimeoutMS: 30 * 1000, // 30 secs
      heartbeatFrequencyMS: 5 * 1000, // 30 secs
    },
  };
});
