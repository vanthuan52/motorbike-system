import { registerAs } from '@nestjs/config';
import { IsOptional, IsString } from 'class-validator';
import validateConfig from '@/common/utils/validate-config';

export type DocConfig = {
  name: string;
  description: string;
  prefix: string;
};

class EnvironmentVariablesValidator {
  @IsString()
  @IsOptional()
  name: string;
}

export default registerAs('docs', () => {
  validateConfig(process.env, EnvironmentVariablesValidator);

  return {
    name: `${process.env.APP_NAME ?? 'Nestjs App'} APIs Specification`,
    description: 'Section for describe whole APIs',
    prefix: '/docs',
  };
});
