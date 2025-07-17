import { DatabaseEntityBase } from '@/common/database/bases/database.entity';
import {
  DatabaseEntity,
  DatabaseProp,
  DatabaseSchema,
} from '@/common/database/decorators/database.decorator';
import { IDatabaseDocument } from '@/common/database/interfaces/database.interface';
import { AwsS3Entity, AwsS3Schema } from '@/modules/aws/entities/aws.s3.entity';
import { UserEntity } from '@/modules/user/entities/user.entity';
import { VehicleModelEntity } from '@/modules/vehicle-model/entities/vehicle-model.entity';

export const UserVehicleTableName = 'user_vehicles';

@DatabaseEntity({ collection: UserVehicleTableName })
export class UserVehicleEntity extends DatabaseEntityBase {
  @DatabaseProp({
    required: true,
    ref: () => UserEntity.name,
  })
  user: string;

  @DatabaseProp({
    required: true,
    ref: () => VehicleModelEntity.name,
  })
  vehicleModel: string;

  @DatabaseProp({
    required: false,
    maxlength: 20,
  })
  color?: string;

  @DatabaseProp({
    required: true,
    lowercase: true,
    trim: true,
    maxlength: 20,
  })
  licensePlate: string;

  @DatabaseProp({
    required: false,
    lowercase: true,
    trim: true,
    maxlength: 30,
  })
  engineNumber?: string;

  @DatabaseProp({
    required: false,
    lowercase: true,
    trim: true,
    maxlength: 30,
  })
  chassisNumber?: string;

  @DatabaseProp({
    required: false,
    schema: AwsS3Schema,
  })
  photo?: AwsS3Entity;
}

export const UserVehicleSchema = DatabaseSchema(UserVehicleEntity);

export type UserVehicleDoc = IDatabaseDocument<UserVehicleEntity>;
