import { registerAs } from '@nestjs/config';
import { IsOptional, IsString } from 'class-validator';
import { ENUM_MESSAGE_LANGUAGE } from '@/common/message/enums/message.enum';
import validateConfig from '@/common/utils/validate-config';

export type MessageConfig = {
  availableLanguage: string[];
  language: string;
};

class EnvironmentVariablesValidator {
  @IsString()
  @IsOptional()
  language: string;
}

export default registerAs('message', (): Record<string, any> => {
  validateConfig(process.env, EnvironmentVariablesValidator);

  return {
    availableLanguage: Object.values(ENUM_MESSAGE_LANGUAGE),
    language: process.env.APP_LANGUAGE ?? ENUM_MESSAGE_LANGUAGE.EN,
  };
});
