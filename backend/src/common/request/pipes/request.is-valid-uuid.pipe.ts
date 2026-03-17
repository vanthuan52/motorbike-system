import { EnumRequestStatusCodeError } from '@/common/request/enums/request.status-code.enum';
import {
  ArgumentMetadata,
  BadRequestException,
  Injectable,
} from '@nestjs/common';
import { PipeTransform } from '@nestjs/common';
import { isUUID } from 'class-validator';

/**
 * Pipe that validates if the input value is a valid UUID
 */
@Injectable()
export class RequestIsValidUuidPipe implements PipeTransform {
  /**
   * Validates and transforms the input value to ensure it's a valid UUID
   * @param {string} value - The input value to validate
   * @param {ArgumentMetadata} metadata - NestJS argument metadata containing validation context
   * @returns {Promise<string>} Promise that resolves to the validated UUID string
   */
  async transform(value: string, metadata: ArgumentMetadata): Promise<string> {
    if (!value || typeof value !== 'string' || !isUUID(value)) {
      throw new BadRequestException({
        statusCode: EnumRequestStatusCodeError.validation,
        message: 'request.error.isUuid',
        metadata: {
          customProperty: {
            messageProperties: {
              property: metadata.data,
            },
          },
        },
      });
    }

    return value;
  }
}
