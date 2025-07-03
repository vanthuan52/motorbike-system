import { DatabaseEntityBase } from '@/common/database/bases/database.entity';
import {
  DatabaseEntity,
  DatabaseProp,
  DatabaseSchema,
} from '@/common/database/decorators/database.decorator';
import { IDatabaseDocument } from '@/common/database/interfaces/database.interface';
import { VehicleServiceEntity } from '@/modules/vehicle-service/entities/vehicle-service.entity';
import { VehicleModelEntity } from '@/modules/vehicle-model/entities/vehicle-model.entity';

export const ServicePriceTableName = 'service_prices';

@DatabaseEntity({
  collection: ServicePriceTableName,
})
export class ServicePriceEntity extends DatabaseEntityBase {
  @DatabaseProp({
    required: true,
    default: 150000,
  })
  price: number;

  @DatabaseProp({
    required: true,
    ref: () => VehicleServiceEntity.name,
  })
  vehicleService: string;

  @DatabaseProp({
    required: true,
    ref: () => VehicleModelEntity.name,
  })
  vehicleModel: string;

  @DatabaseProp({
    required: true,
    default: () => new Date(),
  })
  dateStart: Date;

  @DatabaseProp({
    type: Date,
    required: false,
    default: null,
    // default: () =>
    //   new Date(new Date().setFullYear(new Date().getFullYear() + 100)),
  })
  dateEnd: Date | null;
}

export const ServicePriceSchema = DatabaseSchema(ServicePriceEntity);

export type ServicePriceDoc = IDatabaseDocument<ServicePriceEntity>;
