/**
 * Media module error status codes
 * @description Error codes specific to media operations
 */
export enum EnumMediaStatusCodeError {
  NotFound = 4201,
  KeyAlreadyExists = 4202,
  InvalidMimeType = 4203,
  FileTooLarge = 4204,
  UploadFailed = 4205,
  DeleteFailed = 4206,
  PresignFailed = 4207,
  StatusInvalid = 4208,
}
