import { registerAs } from '@nestjs/config';

export type AuthConfig = {};

export default registerAs('auth', (): Record<string, any> => {
  return {};
});
