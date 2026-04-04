import { EnumServicePriceStatus } from '../enums/service-price.enum';

export const ServicePriceDefaultAvailableSearch: string[] = [];
export const ServicePriceDefaultAvailableOrderBy = [
  'dateStart',
  'dateEnd',
  'createdAt',
];
export const ServicePriceDefaultStatus = Object.values(EnumServicePriceStatus);
