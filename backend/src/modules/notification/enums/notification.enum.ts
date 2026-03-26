export enum EnumNotificationProcess {
  welcomeByAdmin = 'welcomeByAdmin',
  welcome = 'welcome',
  welcomeSocial = 'welcomeSocial',
  temporaryPasswordByAdmin = 'temporaryPasswordByAdmin',
  changePassword = 'changePassword',
  verifiedEmail = 'verifiedEmail',
  verifiedMobileNumber = 'verifiedMobileNumber',
  verificationEmail = 'verificationEmail',
  forgotPassword = 'forgotPassword',
  resetPassword = 'resetPassword',
  newDeviceLogin = 'newDeviceLogin',
  resetTwoFactorByAdmin = 'resetTwoFactorByAdmin',
  publishTermPolicy = 'publishTermPolicy',
  userAcceptTermPolicy = 'userAcceptTermPolicy',
}

export enum EnumNotificationPushProcess {
  cleanupTokens = 'cleanupTokens',
  cleanupStaleTokens = 'cleanupStaleTokens',
  resetTwoFactorByAdmin = 'resetTwoFactorByAdmin',
  temporaryPasswordByAdmin = 'temporaryPasswordByAdmin',
  resetPassword = 'resetPassword',
  newDeviceLogin = 'newDeviceLogin',
}

export enum EnumNotificationType {
  securityAlert = 'securityAlert',
  transactional = 'transactional',
  userActivity = 'userActivity',
  marketing = 'marketing',
}

export enum EnumNotificationChannel {
  push = 'push',
  email = 'email',
  inApp = 'inApp',
  silent = 'silent',
}
