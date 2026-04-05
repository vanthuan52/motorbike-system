import { registerAs } from '@nestjs/config';
import { EnumMessageLanguage } from '@/common/message/enums/message.enum';

export interface IConfigMessage {
  availableLanguage: string[];
  language: string;
}

export default registerAs(
  'message',
  (): IConfigMessage => ({
    availableLanguage: Object.values(EnumMessageLanguage),
    language: process.env.APP_LANGUAGE ?? EnumMessageLanguage.en,
  })
);
