import { registerAs } from '@nestjs/config';

export type UserConfig = {
  vehicleServicePrefix: string;
  vehicleServicePattern: string;
  uploadPath: string;
};

export default registerAs(
  'vehicleService',
  (): Record<string, any> => ({
    vehicleServicePrefix: 'vehicleService',
    vehicleServicePattern: /^[a-zA-Z0-9-_]+$/,
    uploadPath: '/vehicleServices/{vehicleService}',
  }),
);
