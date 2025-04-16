import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { DatabaseEntityBase } from '@/common/database/bases/database.entity';
import {
  ENUM_USER_GENDER,
  ENUM_USER_STATUS,
  ENUM_USER_TYPE,
} from '../enums/user.enum';
import { IDatabaseDocument } from '@/common/database/interfaces/database.interface';

export type UserDocument = UserEntity & Document;

export const UserTableName = 'users';

@Schema({ collection: UserTableName })
export class UserEntity extends DatabaseEntityBase {
  @Prop({ required: false, trim: true, maxlength: 100 })
  first_name: string;

  @Prop({ required: false, trim: true, maxlength: 100 })
  last_name: string;

  @Prop({
    required: true,
    unique: true,
    index: true,
    trim: true,
    maxlength: 100,
  })
  email: string;

  @Prop({
    required: false,
    trim: true,
    maxlength: 20,
    minlength: 8,
  })
  phone?: string;

  @Prop({
    required: true,
    trim: true,
    select: false,
  })
  password: string;

  @Prop({
    required: true,
    default: ENUM_USER_TYPE.CUSTOMER,
    index: true,
    enum: ENUM_USER_TYPE,
  })
  type: ENUM_USER_TYPE;

  @Prop({
    required: true,
    index: true,
  })
  ref_id?: string;

  @Prop({
    required: true,
    default: ENUM_USER_STATUS.ACTIVE,
    index: true,
    enum: ENUM_USER_STATUS,
  })
  status: ENUM_USER_STATUS;

  @Prop({ required: false })
  photo?: string;

  @Prop({ required: false, enum: ENUM_USER_GENDER })
  gender?: ENUM_USER_GENDER;

  @Prop({ required: false, type: Date })
  dob?: Date;

  @Prop({ required: false, trim: true })
  address?: string;

  @Prop({ required: false, trim: true })
  ward?: string;

  @Prop({ required: false, trim: true })
  district?: string;

  @Prop({ required: false, trim: true })
  city?: string;
}

export const UserSchema = SchemaFactory.createForClass(UserEntity);
