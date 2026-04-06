import { registerAs } from '@nestjs/config';

export interface IVehicleServiceConfig {
  uploadImagePath: string;
}

export default registerAs(
  'vehicleService',
  (): IVehicleServiceConfig => ({
    uploadImagePath: 'vehicleServices/{vehicleService}/images',
  })
);
