import {
  EnumUserStatus,
  EnumUserGender,
  EnumUserSignUpFrom,
  EnumUserSignUpWith,
  EnumUserLoginFrom,
  EnumUserLoginWith,
} from '../enums/user.enum';

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
  photo?: any;

  signUpDate?: Date;
  signUpFrom?: EnumUserSignUpFrom;
  signUpWith?: EnumUserSignUpWith;

  lastLoginAt?: Date;
  lastLoginFrom?: EnumUserLoginFrom;
  lastLoginWith?: EnumUserLoginWith;

  verification?: any;

  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;

  createdBy?: string;
  updatedBy?: string;
  deletedBy?: string;
}
