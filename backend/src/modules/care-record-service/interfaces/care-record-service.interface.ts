import { VehicleServiceEntity } from '@/modules/vehicle-service/entities/vehicle-service.entity';
import {
  CareRecordServiceDoc,
  CareRecordServiceEntity,
} from '../entities/care-record-service.entity';
import { CareRecordEntity } from '@/modules/care-record/entities/care-record.entity';

export interface ICareRecordServiceEntity
  extends Omit<CareRecordServiceEntity, 'careRecord' | 'vehicleService'> {
  careRecord: CareRecordEntity;
  vehicleService: VehicleServiceEntity;
}

export interface ICareRecordServiceDoc
  extends Omit<CareRecordServiceDoc, 'careRecord' | 'vehicleService'> {
  careRecord: CareRecordEntity;
  vehicleService: VehicleServiceEntity;
}
