import { ValidationError } from '@nestjs/common';
import {
  IMessageErrorOptions,
  IMessageSetOptions,
  IMessageValidationError,
  IMessageValidationImportError,
  IMessageValidationImportErrorParam,
} from './message.interface';

export interface IMessageService {
  filterLanguage(customLanguage: string): string[];
  setMessage(path: string, options?: IMessageSetOptions): string;
  setValidationMessage(
    errors: ValidationError[],
    options?: IMessageErrorOptions,
  ): IMessageValidationError[];
  setValidationImportMessage(
    errors: IMessageValidationImportErrorParam[],
    options?: IMessageErrorOptions,
  ): IMessageValidationImportError[];
}
