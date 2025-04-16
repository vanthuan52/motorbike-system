import { AppConfig } from './app-config.type';
import { DocConfig } from './doc.config.type';
import { DatabaseConfig } from '@/common/database/config/database-config.type';
import { AwsConfig } from '@/modules/aws/config/aws-config.type';

export type AllConfigType = {
  app: AppConfig;
  docs: DocConfig;
  database: DatabaseConfig;
  aws: AwsConfig;
};
