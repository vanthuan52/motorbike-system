import { registerAs } from '@nestjs/config';

export type IDatabaseConfig = {
  uri?: string;
  host?: string;
  name?: string;
  username?: string;
  password?: string;
  debug?: boolean;
};

export default registerAs('database', () => {
  return {
    uri: process.env.DATABASE_URI,
    host:
      process.env.DATABASE_HOST ??
      'mongodb://localhost:27017,localhost:27018,localhost:27019',
    name: process.env.DATABASE_NAME,
    username: process.env.DATABASE_USERNAME,
    password: process.env.DATABASE_PASSWORD,
    debug: process.env.DATABASE_DEBUG === 'true',
    timeoutOptions: {
      serverSelectionTimeoutMS: 30 * 1000, // 30 secs
      socketTimeoutMS: 30 * 1000, // 30 secs
      heartbeatFrequencyMS: 5 * 1000, // 30 secs
    },
    poolOptions: {
      maxPoolSize: 20,
      minPoolSize: 5,
      maxIdleTimeMS: 60000,
      waitQueueTimeoutMS: 30000,
    },
  };
});
