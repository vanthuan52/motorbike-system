import { registerAs } from '@nestjs/config';

export interface IVehicleServiceConfig {
  vehicleServicePrefix: string;
  vehicleServicePattern: RegExp;
  uploadImagePath: string;
}

export default registerAs(
  'vehicleService',
  (): IVehicleServiceConfig => ({
    vehicleServicePrefix: 'vehicleService',
    vehicleServicePattern: /^[a-zA-Z0-9-_]+$/,
    uploadImagePath: 'vehicleServices/{vehicleService}',
  }),
);
