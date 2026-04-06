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

  // Password History permissions
  ...generatePermissionsForSubject(
    EnumPolicySubject.passwordHistory,
    'passwordHistory',
    'Password Histories'
  ),

  // Media permissions
  ...generatePermissionsForSubject(
    EnumPolicySubject.media,
    'media',
    'Media'
  ),

  // Notification permissions
  ...generatePermissionsForSubject(
    EnumPolicySubject.notification,
    'notification',
    'Notifications'
  ),

  // Setting permissions
  ...generatePermissionsForSubject(
    EnumPolicySubject.setting,
    'setting',
    'Settings'
  ),

  // Verification permissions
  ...generatePermissionsForSubject(
    EnumPolicySubject.verification,
    'verification',
    'Verifications'
  ),

  // Vehicle Brand permissions
  ...generatePermissionsForSubject(
    EnumPolicySubject.vehicleBrand,
    'vehicleBrand',
    'Vehicle Brands'
  ),

  // Vehicle Model permissions
  ...generatePermissionsForSubject(
    EnumPolicySubject.vehicleModel,
    'vehicleModel',
    'Vehicle Models'
  ),

  // Vehicle Service permissions
  ...generatePermissionsForSubject(
    EnumPolicySubject.vehicleService,
    'vehicleService',
    'Vehicle Services'
  ),

  // Service Category permissions
  ...generatePermissionsForSubject(
    EnumPolicySubject.serviceCategory,
    'serviceCategory',
    'Service Categories'
  ),

  // Service Price permissions
  ...generatePermissionsForSubject(
    EnumPolicySubject.servicePrice,
    'servicePrice',
    'Service Prices'
  ),

  // Service Checklist permissions
  ...generatePermissionsForSubject(
    EnumPolicySubject.serviceChecklist,
    'serviceChecklist',
    'Service Checklists'
  ),

  // Part permissions
  ...generatePermissionsForSubject(
    EnumPolicySubject.part,
    'part',
    'Parts'
  ),

  // Part Type permissions
  ...generatePermissionsForSubject(
    EnumPolicySubject.partType,
    'partType',
    'Part Types'
  ),

  // Appointment permissions
  ...generatePermissionsForSubject(
    EnumPolicySubject.appointment,
    'appointment',
    'Appointments'
  ),

  // Store permissions
  ...generatePermissionsForSubject(
    EnumPolicySubject.store,
    'store',
    'Stores'
  ),

  // Care Area permissions
  ...generatePermissionsForSubject(
    EnumPolicySubject.careArea,
    'careArea',
    'Care Areas'
  ),

  // Care Record permissions
  ...generatePermissionsForSubject(
    EnumPolicySubject.careRecord,
    'careRecord',
    'Care Records'
  ),

  // Care Record Checklist permissions
  ...generatePermissionsForSubject(
    EnumPolicySubject.careRecordChecklist,
    'careRecordChecklist',
    'Care Record Checklists'
  ),

  // Care Record Condition permissions
  ...generatePermissionsForSubject(
    EnumPolicySubject.careRecordCondition,
    'careRecordCondition',
    'Care Record Conditions'
  ),

  // Care Record Item permissions
  ...generatePermissionsForSubject(
    EnumPolicySubject.careRecordItem,
    'careRecordItem',
    'Care Record Items'
  ),

  // Care Record Media permissions
  ...generatePermissionsForSubject(
    EnumPolicySubject.careRecordMedia,
    'careRecordMedia',
    'Care Record Media'
  ),

  // Care Record Service permissions
  ...generatePermissionsForSubject(
    EnumPolicySubject.careRecordService,
    'careRecordService',
    'Care Record Services'
  ),

  // Job permissions
  ...generatePermissionsForSubject(
    EnumPolicySubject.job,
    'job',
    'Jobs'
  ),

  // Job Application permissions
  ...generatePermissionsForSubject(
    EnumPolicySubject.jobApplication,
    'jobApplication',
    'Job Applications'
  ),

  // Application Review permissions
  ...generatePermissionsForSubject(
    EnumPolicySubject.applicationReview,
    'applicationReview',
    'Application Reviews'
  ),

  // Message permissions
  ...generatePermissionsForSubject(
    EnumPolicySubject.message,
    'message',
    'Messages'
  ),

  // Conversation permissions
  ...generatePermissionsForSubject(
    EnumPolicySubject.conversation,
    'conversation',
    'Conversations'
  ),

  // User Vehicle permissions
  ...generatePermissionsForSubject(
    EnumPolicySubject.userVehicle,
    'userVehicle',
    'User Vehicles'
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
