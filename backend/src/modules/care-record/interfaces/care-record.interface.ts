import {
  CareRecordDoc,
  CareRecordEntity,
} from '../entities/care-record.entity';
import { ENUM_SERVICE_PRICE_STATUS } from '../enums/service-price.enum';

export interface ICareRecordEntity
  extends Omit<CareRecordEntity, 'CareRecord'> {
  CareRecord: CareRecordEntity;
}

export interface ICareRecordDoc extends Omit<CareRecordDoc, 'CareRecord'> {
  CareRecord: CareRecordDoc;
}

export interface IModelCareRecord
  extends Omit<
    CareRecordEntity,
    | '_id'
    | 'price'
    | 'vehicleService'
    | 'vehicleModel'
    | 'dateStart'
    | 'dateEnd'
  > {
  _id: string | null;
  CareRecordId: string;

  vehicleServiceId: string;
  vehicleServiceName: string;

  vehicleModelId: string;
  vehicleModelName: string;

  status: ENUM_SERVICE_PRICE_STATUS;

  price: number | null;
  dateStart: Date | null;
  dateEnd: Date | null;
}
