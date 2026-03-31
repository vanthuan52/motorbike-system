import { EnumAppEnvironment } from '@/app/enums/app.enum';

export interface IMigrationRoleData {
  name: string;
  description: string;
  type: string;
}

const roleData: IMigrationRoleData[] = [
  {
    name: 'superadmin',
    description: 'Super Admin Role - Full system access',
    type: 'superadmin',
  },
  {
    name: 'admin',
    description: 'Admin Role - Manage system resources',
    type: 'admin',
  },
  {
    name: 'user',
    description: 'User Role - Basic access',
    type: 'user',
  },
];

export const migrationRoleData: Record<
  EnumAppEnvironment,
  IMigrationRoleData[]
> = {
  [EnumAppEnvironment.local]: roleData,
  [EnumAppEnvironment.development]: roleData,
  [EnumAppEnvironment.staging]: roleData,
  [EnumAppEnvironment.production]: roleData,
};
