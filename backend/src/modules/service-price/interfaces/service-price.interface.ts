import {
  ServicePriceDoc,
  ServicePriceEntity,
} from '../entities/service-price.entity';
import { ENUM_SERVICE_PRICE_STATUS } from '../enums/service-price.enum';

export interface IServicePriceEntity
  extends Omit<ServicePriceEntity, 'ServicePrice'> {
  servicePrice: ServicePriceEntity;
}

export interface IServicePriceDoc
  extends Omit<ServicePriceDoc, 'ServicePrice'> {
  servicePrice: ServicePriceDoc;
}

export interface ICustomServicePrice
  extends Omit<
    ServicePriceEntity,
    | '_id'
    | 'price'
    | 'vehicleService'
    | 'vehicleModel'
    | 'dateStart'
    | 'dateEnd'
  > {
  _id: string | null;
  servicePriceId: string;

  vehicleServiceId: string;
  vehicleServiceName: string;

  vehicleModelId: string;
  vehicleModelName: string;

  status: ENUM_SERVICE_PRICE_STATUS;

  price: number | null;
  dateStart: Date | null;
  dateEnd: Date | null;
}
