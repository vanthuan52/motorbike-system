import { registerAs } from '@nestjs/config';

export interface IVehicleServiceConfig {
  vehiclePrefix: string;
  uploadPhotoProfilePath: string;
}

export default registerAs(
  'user',
  (): IVehicleServiceConfig => ({
    vehiclePrefix: 'vehicle',
    uploadPhotoProfilePath: 'users/{userId}/vehicles',
  }),
);
