import databaseConfig from '@/common/database/config/database.config';
import appConfig from './app.config';
import authConfig from './auth.config';
import debugConfig from './debug.config';
import docConfig from './doc.config';
import helperConfig from './helper.config';
import messageConfig from './message.config';
import userConfig from './user.config';
import middlewareConfig from './middleware.config';
import awsConfig from '@/modules/aws/config/aws.config';
import vehicleServiceConfig from './vehicle-service.config';

export default [
  appConfig,
  databaseConfig,
  authConfig,
  docConfig,
  awsConfig,
  helperConfig,
  debugConfig,
  messageConfig,
  userConfig,
  middlewareConfig,
  vehicleServiceConfig,
];
