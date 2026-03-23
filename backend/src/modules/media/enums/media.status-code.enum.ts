/**
 * Media module error status codes
 * @description Error codes specific to media operations
 */
export enum EnumMediaStatusCodeError {
  notFound = 4201,
  keyAlreadyExists = 4202,
  invalidMimeType = 4203,
  fileTooLarge = 4204,
  uploadFailed = 4205,
  deleteFailed = 4206,
  presignFailed = 4207,
  statusInvalid = 4208,
}
