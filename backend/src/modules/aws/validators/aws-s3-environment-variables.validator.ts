import { IsString, IsOptional, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

class AwsCredentialValidator {
  @IsString()
  key: string;

  @IsString()
  secret: string;
}

class AwsPublicConfigValidator {
  @ValidateNested()
  @Type(() => AwsCredentialValidator)
  credential: AwsCredentialValidator;

  @IsString()
  bucket: string;

  @IsString()
  region: string;

  @IsString()
  baseUrl: string;

  @IsOptional()
  @IsString()
  cdnUrl?: string;
}

class AwsPrivateConfigValidator {
  @ValidateNested()
  @Type(() => AwsCredentialValidator)
  credential: AwsCredentialValidator;

  @IsString()
  bucket: string;

  @IsString()
  region: string;

  @IsString()
  baseUrl: string;
}

export class AwsS3EnvironmentVariablesValidator {
  @IsString()
  AWS_S3_PUBLIC_CREDENTIAL_KEY: string;

  @IsString()
  AWS_S3_PUBLIC_CREDENTIAL_SECRET: string;

  @IsString()
  AWS_S3_PUBLIC_BUCKET: string;

  @IsString()
  AWS_S3_PUBLIC_REGION: string;

  @IsString()
  AWS_S3_PUBLIC_CDN: string;

  @IsString()
  AWS_S3_PRIVATE_CREDENTIAL_KEY: string;

  @IsString()
  AWS_S3_PRIVATE_CREDENTIAL_SECRET: string;

  @IsString()
  AWS_S3_PRIVATE_BUCKET: string;

  @IsString()
  AWS_S3_PRIVATE_REGION: string;
}
