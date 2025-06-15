import { AppConfig } from './app.config';
import { DocConfig } from './doc.config';
import { DebugConfig } from './debug.config';
import { DatabaseConfig } from '@/common/database/config/database.config';
import { AwsConfig } from '@/modules/aws/config/aws.config';
import { HelperConfig } from './helper.config';
import { MessageConfig } from './message.config';
import { UserConfig } from './user.config';

export type AllConfigType = {
  app: AppConfig;
  docs: DocConfig;
  database: DatabaseConfig;
  aws: AwsConfig;
  debug: DebugConfig;
  helper: HelperConfig;
  message: MessageConfig;
  user: UserConfig;
};
