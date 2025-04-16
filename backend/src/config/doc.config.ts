import validateConfig from '@/common/utils/validate-config';
import { registerAs } from '@nestjs/config';
import { IsOptional, IsString } from 'class-validator';

class EnvironmentVariablesValidator {
  @IsString()
  @IsOptional()
  name: string;

  @IsString()
  @IsOptional()
  description: string;

  @IsString()
  @IsOptional()
  prefix: string;
}

export default registerAs('docs', () => {
  validateConfig(process.env, EnvironmentVariablesValidator);

  return {
    name: `${process.env.APP_NAME} APIs Specification`,
    description: 'Section for describe whole APIs',
    prefix: '/docs',
  };
});
