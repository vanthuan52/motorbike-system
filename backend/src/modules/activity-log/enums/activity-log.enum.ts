export enum EnumActivityLogAction {
  userLoginCredential = 'userLoginCredential',
  userLoginGoogle = 'userLoginGoogle',
  userLoginApple = 'userLoginApple',
  userLogout = 'userLogout',
  userRefreshToken = 'userRefreshToken',
  userChangePassword = 'userChangePassword',
  userUpdateProfile = 'userUpdateProfile',
  userForgotPassword = 'userForgotPassword',
  userResetPassword = 'userResetPassword',
  userVerifyEmail = 'userVerifyEmail',
  userVerifiedEmail = 'userVerifiedEmail',
  userCreated = 'userCreated',
  userBlocked = 'userBlocked',
  userUpdateStatus = 'userUpdateStatus',
  userUpdatePhotoProfile = 'userUpdatePhotoProfile',
  userDeleteSelf = 'userDeleteSelf',
  userClaimUsername = 'userClaimUsername',
  userUpdatePasswordByAdmin = 'userUpdatePasswordByAdmin',
  userSendVerificationEmail = 'userSendVerificationEmail',
  userRevokeSession = 'userRevokeSession',
  userRevokeSessionByAdmin = 'userRevokeSessionByAdmin',
  adminSessionRevoke = 'adminSessionRevoke',
  adminUserCreate = 'adminUserCreate',
  adminUserUpdateStatus = 'adminUserUpdateStatus',
  adminUserUpdatePassword = 'adminUserUpdatePassword',
  adminUserImport = 'adminUserImport',
  adminDeviceRemove = 'adminDeviceRemove',
  adminRoleCreate = 'adminRoleCreate',
  adminRoleUpdate = 'adminRoleUpdate',
  adminRoleDelete = 'adminRoleDelete',
  adminServicePriceCreate = 'adminServicePriceCreate',
  adminServicePriceUpdate = 'adminServicePriceUpdate',
  adminServicePriceDelete = 'adminServicePriceDelete',
  adminServiceChecklistCreate = 'adminServiceChecklistCreate',
  adminServiceChecklistUpdate = 'adminServiceChecklistUpdate',
  adminServiceChecklistDelete = 'adminServiceChecklistDelete',
  adminServiceChecklistRestore = 'adminServiceChecklistRestore',
  adminServiceChecklistForceDelete = 'adminServiceChecklistForceDelete',
  adminApiKeyCreate = 'adminApiKeyCreate',
  adminApiKeyReset = 'adminApiKeyReset',
  adminApiKeyUpdate = 'adminApiKeyUpdate',
  adminApiKeyUpdateDate = 'adminApiKeyUpdateDate',
  adminApiKeyUpdateStatus = 'adminApiKeyUpdateStatus',
  adminApiKeyDelete = 'adminApiKeyDelete',

  // device
  userDeviceRefresh = 'userDeviceRefresh',
  userRemoveDevice = 'userRemoveDevice',

  // Vehicle Brand
  adminVehicleBrandCreate = 'adminVehicleBrandCreate',
  adminVehicleBrandUpdate = 'adminVehicleBrandUpdate',
  adminVehicleBrandUpdateStatus = 'adminVehicleBrandUpdateStatus',
  adminVehicleBrandDelete = 'adminVehicleBrandDelete',

  // Vehicle Model
  adminVehicleModelCreate = 'adminVehicleModelCreate',
  adminVehicleModelUpdate = 'adminVehicleModelUpdate',
  adminVehicleModelUpdateStatus = 'adminVehicleModelUpdateStatus',
  adminVehicleModelDelete = 'adminVehicleModelDelete',

  // Vehicle Service
  adminVehicleServiceCreate = 'adminVehicleServiceCreate',
  adminVehicleServiceUpdate = 'adminVehicleServiceUpdate',
  adminVehicleServiceUpdateStatus = 'adminVehicleServiceUpdateStatus',
  adminVehicleServiceDelete = 'adminVehicleServiceDelete',

  // User Vehicle
  adminUserVehicleCreate = 'adminUserVehicleCreate',
  adminUserVehicleUpdate = 'adminUserVehicleUpdate',
  adminUserVehicleDelete = 'adminUserVehicleDelete',

  // Service Category
  adminServiceCategoryCreate = 'adminServiceCategoryCreate',
  adminServiceCategoryUpdate = 'adminServiceCategoryUpdate',
  adminServiceCategoryUpdateStatus = 'adminServiceCategoryUpdateStatus',
  adminServiceCategoryDelete = 'adminServiceCategoryDelete',

  // Permission
  adminPermissionCreate = 'adminPermissionCreate',
  adminPermissionUpdate = 'adminPermissionUpdate',
  adminPermissionDelete = 'adminPermissionDelete',

  // Appointment
  adminAppointmentCreate = 'adminAppointmentCreate',
  adminAppointmentUpdate = 'adminAppointmentUpdate',
  adminAppointmentUpdateStatus = 'adminAppointmentUpdateStatus',
  adminAppointmentDelete = 'adminAppointmentDelete',
  adminAppointmentRestore = 'adminAppointmentRestore',
  adminAppointmentForceDelete = 'adminAppointmentForceDelete',

  // Care Area
  adminCareAreaCreate = 'adminCareAreaCreate',
  adminCareAreaUpdate = 'adminCareAreaUpdate',
  adminCareAreaDelete = 'adminCareAreaDelete',
  adminCareAreaRestore = 'adminCareAreaRestore',
  adminCareAreaForceDelete = 'adminCareAreaForceDelete',

  // Care Record
  adminCareRecordCreate = 'adminCareRecordCreate',
  adminCareRecordUpdate = 'adminCareRecordUpdate',
  adminCareRecordUpdateStatus = 'adminCareRecordUpdateStatus',
  adminCareRecordUpdatePaymentStatus = 'adminCareRecordUpdatePaymentStatus',
  adminCareRecordUpdateTechnician = 'adminCareRecordUpdateTechnician',
  adminCareRecordDelete = 'adminCareRecordDelete',
  adminCareRecordCreateChecklist = 'adminCareRecordCreateChecklist',
  adminCareRecordRestore = 'adminCareRecordRestore',
  adminCareRecordForceDelete = 'adminCareRecordForceDelete',

  // Care Record Condition
  adminCareRecordConditionCreate = 'adminCareRecordConditionCreate',
  adminCareRecordConditionUpdate = 'adminCareRecordConditionUpdate',
  adminCareRecordConditionDelete = 'adminCareRecordConditionDelete',

  // Care Record Item
  adminCareRecordItemCreate = 'adminCareRecordItemCreate',
  adminCareRecordItemUpdate = 'adminCareRecordItemUpdate',
  adminCareRecordItemApproval = 'adminCareRecordItemApproval',
  adminCareRecordItemDelete = 'adminCareRecordItemDelete',

  // Care Record Media
  adminCareRecordMediaCreate = 'adminCareRecordMediaCreate',
  adminCareRecordMediaUpdate = 'adminCareRecordMediaUpdate',
  adminCareRecordMediaDelete = 'adminCareRecordMediaDelete',

  // Care Record Service
  adminCareRecordServiceCreate = 'adminCareRecordServiceCreate',
  adminCareRecordServiceUpdate = 'adminCareRecordServiceUpdate',
  adminCareRecordServiceUpdateStatus = 'adminCareRecordServiceUpdateStatus',
  adminCareRecordServiceDelete = 'adminCareRecordServiceDelete',

  // Part
  adminPartCreate = 'adminPartCreate',
  adminPartUpdate = 'adminPartUpdate',
  adminPartUpdateStatus = 'adminPartUpdateStatus',
  adminPartDelete = 'adminPartDelete',

  // Part Type
  adminPartTypeCreate = 'adminPartTypeCreate',
  adminPartTypeUpdate = 'adminPartTypeUpdate',
  adminPartTypeUpdateStatus = 'adminPartTypeUpdateStatus',
  adminPartTypeDelete = 'adminPartTypeDelete',
  adminPartTypeRestore = 'adminPartTypeRestore',
  adminPartTypeForceDelete = 'adminPartTypeForceDelete',

  // Store
  adminStoreCreate = 'adminStoreCreate',
  adminStoreUpdate = 'adminStoreUpdate',
  adminStoreUpdateStatus = 'adminStoreUpdateStatus',
  adminStoreDelete = 'adminStoreDelete',
  adminStoreRestore = 'adminStoreRestore',
  adminStoreForceDelete = 'adminStoreForceDelete',

  // Job
  adminJobCreate = 'adminJobCreate',
  adminJobUpdate = 'adminJobUpdate',
  adminJobUpdateStatus = 'adminJobUpdateStatus',
  adminJobDelete = 'adminJobDelete',

  // JobApplication
  adminJobApplicationUpdateStatus = 'adminJobApplicationUpdateStatus',

  // JobApplication Review
  adminApplicationReviewCreate = 'adminApplicationReviewCreate',

  // Care Record Checklist
  adminCareRecordChecklistCreate = 'adminCareRecordChecklistCreate',
  adminCareRecordChecklistUpdate = 'adminCareRecordChecklistUpdate',
  adminCareRecordChecklistUpdateStatus = 'adminCareRecordChecklistUpdateStatus',
  adminCareRecordChecklistUpdateResult = 'adminCareRecordChecklistUpdateResult',
  adminCareRecordChecklistDelete = 'adminCareRecordChecklistDelete',

  // Notification
  userNotificationUpdateSetting = 'userNotificationUpdateSetting',
}
