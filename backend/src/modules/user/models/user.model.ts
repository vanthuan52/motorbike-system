import { AwsS3Dto } from '@/common/aws/dtos/aws.s3.dto';
import { RoleModel } from '@/modules/role/models/role.model';
import {
  EnumUserStatus,
  EnumUserGender,
  EnumUserSignUpFrom,
  EnumUserSignUpWith,
  EnumUserLoginFrom,
  EnumUserLoginWith,
} from '../enums/user.enum';

/**
 * Domain model representing a system user.
 * Maps from Prisma User to application domain layer.
 */
export class UserModel {
  id: string;
  username: string;
  name?: string;
  email: string;
  phone?: string;
  password?: string;
  isVerified: boolean;
  verifiedAt?: Date;
  status: EnumUserStatus;
  gender?: EnumUserGender;
  passwordAttempt: number;
  photo?: AwsS3Dto;
  roles?: RoleModel[];

  signUpDate?: Date;
  signUpFrom?: EnumUserSignUpFrom;
  signUpWith?: EnumUserSignUpWith;

  lastLoginAt?: Date;
  lastLoginFrom?: EnumUserLoginFrom;
  lastLoginWith?: EnumUserLoginWith;

  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;

  createdBy?: string;
  updatedBy?: string;
  deletedBy?: string;

  constructor(data?: Partial<UserModel>) {
    Object.assign(this, data);
  }

  isActive(): boolean {
    return this.status === EnumUserStatus.active && !this.deletedAt;
  }

  isDeleted(): boolean {
    return !!this.deletedAt;
  }
}
