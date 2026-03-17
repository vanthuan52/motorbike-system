import { EnumRoleType } from '@/modules/policy/enums/policy.enum';
import { EnumUserStatus } from '../enums/user.enum';

export const UserDefaultAvailableSearch = ['name', 'email'];
export const UserDefaultStatus = Object.values(EnumUserStatus);

export const UserDefaultRoleType = Object.values(EnumRoleType);
