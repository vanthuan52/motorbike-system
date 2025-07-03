import {
  ServicePriceDoc,
  ServicePriceEntity,
} from '../entities/service-price.entity';

export interface IServicePriceEntity
  extends Omit<ServicePriceEntity, 'ServicePrice'> {
  ServicePrice: ServicePriceEntity;
}

export interface IServicePriceDoc
  extends Omit<ServicePriceDoc, 'ServicePrice'> {
  ServicePrice: ServicePriceDoc;
}
