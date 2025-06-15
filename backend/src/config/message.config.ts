import { registerAs } from '@nestjs/config';
import { ENUM_MESSAGE_LANGUAGE } from '@/common/message/enums/message.enum';

export type MessageConfig = {
  availableLanguage: string[];
  language: string;
};

export default registerAs('message', (): Record<string, any> => {
  return {
    availableLanguage: Object.values(ENUM_MESSAGE_LANGUAGE),
    language: process.env.APP_LANGUAGE ?? ENUM_MESSAGE_LANGUAGE.EN,
  };
});
