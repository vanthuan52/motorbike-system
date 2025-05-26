import validateConfig from '@/common/utils/validate-config';
import { registerAs } from '@nestjs/config';

export type HelperConfig = {
  salt: {
    length: number;
  };
};

export default registerAs('helper', (): Record<string, any> => {
  return {
    salt: {
      length: 8,
    },
  };
});
