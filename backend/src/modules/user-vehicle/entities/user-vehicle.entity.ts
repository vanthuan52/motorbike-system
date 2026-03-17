import { DatabaseEntityBase } from '@/common/database/bases/database.entity';
import {
  DatabaseEntity,
  DatabaseProp,
  DatabaseSchema,
} from '@/common/database/decorators/database.decorator';
import { IDatabaseDocument } from '@/common/database/interfaces/database.interface';
import { AwsS3Dto } from '@/common/aws/dtos/aws.s3.dto';
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
  })
  modelYear?: number;

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
  licensePlateNumber: string;

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
    schema: AwsS3Dto,
  })
  photo?: AwsS3Dto;
}

export const UserVehicleSchema = DatabaseSchema(UserVehicleEntity);

export type UserVehicleDoc = IDatabaseDocument<UserVehicleEntity>;
