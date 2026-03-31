import { EnumAppEnvironment } from '@/app/enums/app.enum';
import {
  EnumPolicyAction,
  EnumPolicySubject,
} from '@/modules/policy/enums/policy.enum';

export interface IMigrationPermissionData {
  name: string;
  code: string;
  description: string;
  group: string;
  action: EnumPolicyAction;
  subject: EnumPolicySubject;
}

/**
 * Generate all permission combinations for a given subject.
 */
function generatePermissionsForSubject(
  subject: EnumPolicySubject,
  group: string,
  label: string
): IMigrationPermissionData[] {
  const actions = [
    EnumPolicyAction.read,
    EnumPolicyAction.create,
    EnumPolicyAction.update,
    EnumPolicyAction.delete,
  ];

  return actions.map(action => ({
    name: `${action.charAt(0).toUpperCase() + action.slice(1)} ${label}`,
    code: `${group}:${action}`,
    description: `Permission to ${action} ${label.toLowerCase()}`,
    group,
    action,
    subject,
  }));
}

const permissionData: IMigrationPermissionData[] = [
  // Manage All (superadmin-like)
  {
    name: 'Manage All',
    code: 'all:manage',
    description: 'Full access to all resources',
    group: 'all',
    action: EnumPolicyAction.manage,
    subject: EnumPolicySubject.all,
  },

  // User permissions
  ...generatePermissionsForSubject(EnumPolicySubject.user, 'user', 'Users'),

  // Role permissions
  ...generatePermissionsForSubject(EnumPolicySubject.role, 'role', 'Roles'),

  // API Key permissions
  ...generatePermissionsForSubject(
    EnumPolicySubject.apiKey,
    'apiKey',
    'API Keys'
  ),

  // Session permissions
  ...generatePermissionsForSubject(
    EnumPolicySubject.session,
    'session',
    'Sessions'
  ),

  // Activity Log permissions
  ...generatePermissionsForSubject(
    EnumPolicySubject.activityLog,
    'activityLog',
    'Activity Logs'
  ),

  // Device permissions
  ...generatePermissionsForSubject(
    EnumPolicySubject.device,
    'device',
    'Devices'
  ),
];

export const migrationPermissionData: Record<
  EnumAppEnvironment,
  IMigrationPermissionData[]
> = {
  [EnumAppEnvironment.local]: permissionData,
  [EnumAppEnvironment.development]: permissionData,
  [EnumAppEnvironment.staging]: permissionData,
  [EnumAppEnvironment.production]: permissionData,
};
