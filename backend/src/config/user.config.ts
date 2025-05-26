import { registerAs } from '@nestjs/config';

export type UserConfig = {
  usernamePrefix: string;
  usernamePattern: string;
  uploadPath: string;
};

export default registerAs(
  'user',
  (): Record<string, any> => ({
    usernamePrefix: 'user',
    usernamePattern: /^[a-zA-Z0-9-_]+$/,
    uploadPath: '/users/{user}',
  }),
);
