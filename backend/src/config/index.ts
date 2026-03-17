import databaseConfig from '@/config/database.config';
import appConfig from './app.config';
import authConfig from './auth.config';
import docConfig from './doc.config';
import helperConfig from './helper.config';
import messageConfig from './message.config';
import userConfig from './user.config';
import awsConfig from './aws.config';
import vehicleServiceConfig from './vehicle-service.config';
import loggerConfig from './logger.config';
import emailConfig from './email.config';
import featureFlagConfig from './feature-flag.config';
import forgotPasswordConfig from './forgot-password.config';
import redisConfig from './redis.config';
import requestConfig from './request.config';
import responseConfig from './response.config';
import sessionConfig from './session.config';

export default [
  appConfig,
  databaseConfig,
  authConfig,
  docConfig,
  awsConfig,
  helperConfig,
  loggerConfig,
  emailConfig,
  featureFlagConfig,
  forgotPasswordConfig,
  redisConfig,
  requestConfig,
  responseConfig,
  sessionConfig,
  messageConfig,
  userConfig,
  vehicleServiceConfig,
];
