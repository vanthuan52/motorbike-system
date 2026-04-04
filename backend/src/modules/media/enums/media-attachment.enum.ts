/**
 * Enum of entity types that can have media attached.
 * Used as `attachableType` in MediaAttachment.
 */
export enum EnumMediaAttachableType {
  User = 'User',
  VehicleBrand = 'VehicleBrand',
  VehicleModel = 'VehicleModel',
  VehicleService = 'VehicleService',
  ServiceCategory = 'ServiceCategory',
  Store = 'Store',
  UserVehicle = 'UserVehicle',
  CareRecord = 'CareRecord',
  CareRecordChecklist = 'CareRecordChecklist',
  Job = 'Job',
  JobApplication = 'JobApplication',
  Part = 'Part',
  PartType = 'PartType',
}

/**
 * Enum of purposes for media attachments.
 * Describes the role/context of the attached media within an entity.
 */
export enum EnumMediaAttachmentPurpose {
  default = 'default',
  avatar = 'avatar',
  cover = 'cover',
  thumbnail = 'thumbnail',
  gallery = 'gallery',
  logo = 'logo',
  photo = 'photo',
  before = 'before',
  after = 'after',
  document = 'document',
  resume = 'resume',
}
