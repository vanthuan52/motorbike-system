import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsInt,
  Min,
  IsNumber,
  IsString,
  IsNotEmpty,
  MinLength,
  IsEnum,
  IsOptional,
} from 'class-validator';
import { ENUM_NODE_ENVIRONMENT, ENUM_APP_TIMEZONE } from '../enums/app.enum';
import { ENUM_MESSAGE_LANGUAGE } from '@/common/message/enums/message.enum';

export class AppEnvDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(1)
  APP_NAME: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(1)
  @IsEnum(ENUM_NODE_ENVIRONMENT)
  NODE_ENV: ENUM_NODE_ENVIRONMENT;

  @IsString()
  @IsNotEmpty()
  @IsEnum(ENUM_MESSAGE_LANGUAGE)
  APP_LANGUAGE: ENUM_MESSAGE_LANGUAGE;

  @IsString()
  @IsNotEmpty()
  @IsEnum(ENUM_APP_TIMEZONE)
  APP_TIMEZONE: ENUM_APP_TIMEZONE;

  @IsNotEmpty()
  @IsString()
  @MinLength(1)
  HTTP_HOST: string;

  @IsNumber({
    allowInfinity: false,
    allowNaN: false,
    maxDecimalPlaces: 0,
  })
  @IsInt()
  @Min(1)
  @IsNotEmpty()
  @Type(() => Number)
  HTTP_PORT: number;

  @IsBoolean()
  @IsNotEmpty()
  @Type(() => Boolean)
  DEBUG_ENABLE: boolean;

  @IsBoolean()
  @IsNotEmpty()
  @Type(() => Boolean)
  DEBUG_INTO_FILE: boolean;

  @IsBoolean()
  @IsNotEmpty()
  @Type(() => Boolean)
  DEBUG_PRETTIER: boolean;

  @IsString()
  @IsNotEmpty()
  @MinLength(1)
  MIDDLEWARE_CORS_ORIGIN: string;

  @IsBoolean()
  @IsNotEmpty()
  @Type(() => Boolean)
  URL_VERSIONING_ENABLE: boolean;

  @IsNumber({
    allowInfinity: false,
    allowNaN: false,
    maxDecimalPlaces: 0,
  })
  @Min(1)
  @IsInt()
  @IsNotEmpty()
  @Type(() => Number)
  URL_VERSION: number;

  @IsString()
  @IsOptional()
  DATABASE_URI?: string;

  @IsString()
  @IsOptional()
  DATABASE_HOST?: string;

  @IsString()
  @IsOptional()
  DATABASE_NAME?: string;

  @IsString()
  @IsOptional()
  DATABASE_USER?: string;

  @IsString()
  @IsOptional()
  DATABASE_PASSWORD?: string;

  @IsBoolean()
  @IsNotEmpty()
  @Type(() => Boolean)
  DATABASE_DEBUG: boolean;

  @IsNotEmpty()
  @IsOptional()
  @IsString()
  @MinLength(1)
  AUTH_JWT_ISSUER?: string;

  @IsString()
  @IsOptional()
  @IsNotEmpty()
  @MinLength(1)
  AUTH_JWT_JWKS_URI?: string;

  @IsString()
  @IsOptional()
  @IsNotEmpty()
  @MinLength(1)
  AUTH_JWT_ACCESS_TOKEN_KID?: string;

  @IsString()
  @IsOptional()
  @IsNotEmpty()
  @MinLength(1)
  AUTH_JWT_ACCESS_TOKEN_PRIVATE_KEY_PATH?: string;

  @IsString()
  @IsOptional()
  @IsNotEmpty()
  @MinLength(1)
  AUTH_JWT_ACCESS_TOKEN_PULIC_KEY_PATH?: string;

  @IsNotEmpty()
  @IsOptional()
  @IsString()
  @MinLength(1)
  AUTH_JWT_ACCESS_TOKEN_EXPIRED?: string;

  @IsString()
  @IsOptional()
  @IsNotEmpty()
  @MinLength(1)
  AUTH_JWT_REFRESH_TOKEN_KID?: string;

  @IsString()
  @IsOptional()
  @IsNotEmpty()
  @MinLength(1)
  AUTH_JWT_REFRESH_TOKEN_PRIVATE_KEY_PATH?: string;

  @IsString()
  @IsOptional()
  @IsNotEmpty()
  @MinLength(1)
  AUTH_JWT_REFRESH_TOKEN_PUBLIC_KEY_PATH?: string;

  @IsOptional()
  @IsString()
  AWS_S3_PUBLIC_CREDENTIAL_KEY?: string;

  @IsOptional()
  @IsString()
  AWS_S3_PUBLIC_CREDENTIAL_SECRET?: string;

  @IsOptional()
  @IsString()
  AWS_S3_PUBLIC_BUCKET?: string;

  @IsOptional()
  @IsString()
  AWS_S3_PUBLIC_REGION?: string;

  @IsOptional()
  @IsString()
  AWS_S3_PUBLIC_CND?: string;

  @IsOptional()
  @IsString()
  AWS_S3_PRIVATE_CREDENTIAL_KEY?: string;

  @IsOptional()
  @IsString()
  AWS_S3_PRIVATE_CREDENTIAL_SECRET?: string;

  @IsOptional()
  @IsString()
  AWS_S3_PRIVATE_REGION?: string;

  @IsOptional()
  @IsString()
  AWS_S3_PRIVATE_BUCKET?: string;

  @IsOptional()
  @IsString()
  AWS_SES_CREDENTIAL_KEY?: string;

  @IsOptional()
  @IsString()
  AWS_SES_CREDENTIAL_SECRET?: string;

  @IsOptional()
  @IsString()
  AWS_SES_REGION?: string;

  @IsOptional()
  @IsString()
  AUTH_SOCIAL_GOOGLE_CLIENT_ID?: string;

  @IsOptional()
  @IsString()
  AUTH_SOCIAL_GOOGLE_CLIENT_SECRET?: string;

  @IsOptional()
  @IsString()
  AUTH_SOCIAL_APPLE_CLIENT_ID?: string;

  @IsOptional()
  @IsString()
  AUTH_SOCIAL_APPLE_SIGN_IN_CLIENT_ID?: string;

  @IsNotEmpty()
  @IsString()
  REDIS_HOST: string;

  @IsNumber({
    allowInfinity: false,
    allowNaN: false,
    maxDecimalPlaces: 0,
  })
  @IsInt()
  @Min(1)
  @IsNotEmpty()
  @Type(() => Number)
  REDIS_PORT: number;

  @IsOptional()
  @IsString()
  REDIS_USERNAME?: string;

  @IsOptional()
  @IsString()
  REDIS_PASSWORD?: string;

  @IsOptional()
  @IsString()
  SENTRY_DSN?: string;
}
