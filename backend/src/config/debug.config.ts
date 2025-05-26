import { registerAs } from '@nestjs/config';

export type DebugConfig = {
  enable: boolean;
  level: string;
  intoFile: boolean;
  filePath: string;
  autoLogger: false;
  prettier: boolean;
  sentry: {
    dsn: string;
    timeout: number;
  };
};

export default registerAs<DebugConfig>('debug', () => {
  return {
    enable: process.env.DEBUG_ENABLE === 'true',
    level: process.env.DEBUG_LEVEL ?? 'debug',
    intoFile: process.env.DEBUG_INTO_FILE === 'true',
    filePath: '/logs',
    autoLogger: false,
    prettier: process.env.DEBUG_PRETTIER === 'true',
    sentry: {
      dsn: process.env.SENTRY_DSN ?? '',
      timeout: 10000, // 10s
    },
  };
});
