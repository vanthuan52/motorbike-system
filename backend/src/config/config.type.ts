import { AppConfig } from './app.config';
import { DocConfig } from './doc.config';
import { DebugConfig } from './debug.config';
import { DatabaseConfig } from '@/common/database/config/database.config';
import { AwsConfig } from '@/modules/aws/config/aws-config.type';
import { HelperConfig } from './helper.config';
import { MessageConfig } from './message.config';
import { AuthConfig } from './auth.config';

export type AllConfigType = {
  app: AppConfig;
  docs: DocConfig;
  database: DatabaseConfig;
  auth: AuthConfig;
  aws: AwsConfig;
  debug: DebugConfig;
  helper: HelperConfig;
  message: MessageConfig;
};
