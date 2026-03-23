import {
  ArgumentMetadata,
  BadRequestException,
  Injectable,
} from '@nestjs/common';
import { PipeTransform } from '@nestjs/common';
import { isMongoId } from 'class-validator';
import { EnumRequestStatusCodeError } from '@/common/request/enums/request.status-code.enum';

/**
 * NestJS Pipe that optionally validates MongoDB ObjectId format for route parameters.
 * Used to validate optional ID parameters in API endpoints before they reach controllers.
 * Allows undefined/empty values, but if provided, must be valid MongoDB ObjectId.
 */
@Injectable()
export class RequestOptionalParseObjectIdPipe implements PipeTransform {
  /**
   * Validates that the input value is either empty (undefined/null) or a valid MongoDB ObjectId.
   * Throws BadRequestException if a value is provided but invalid.
   *
   * @param {string} value - The input value to validate as MongoDB ObjectId
   * @param {ArgumentMetadata} metadata - NestJS argument metadata with parameter name and type
   * @returns {string | undefined} The validated MongoDB ObjectId string if valid, or undefined if not provided
   * @throws {BadRequestException} If value is provided but not a valid MongoDB ObjectId format
   */
  async transform(
    value: string | undefined,
    metadata: ArgumentMetadata
  ): Promise<string | undefined> {
    // If no value provided, return undefined (making it optional)
    if (!value) {
      return undefined;
    }

    // If value is provided, validate it as MongoDB ObjectId
    if (typeof value !== 'string' || !isMongoId(value)) {
      throw new BadRequestException({
        statusCode: EnumRequestStatusCodeError.validation,
        message: 'request.error.isMongoId',
        messageProperties: {
          property: metadata.data,
        },
      });
    }

    return value;
  }
}
