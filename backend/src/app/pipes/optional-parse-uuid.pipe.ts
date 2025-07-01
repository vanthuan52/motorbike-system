import {
  ArgumentMetadata,
  Injectable,
  PipeTransform,
  BadRequestException,
} from '@nestjs/common';
import { validate as isUuid } from 'uuid';

@Injectable()
export class OptionalParseUUIDPipe
  implements PipeTransform<any, string | undefined>
{
  transform(value: any, metadata: ArgumentMetadata): string | undefined {
    if (value === null || typeof value === 'undefined' || value === '') {
      return undefined;
    }
    if (typeof value !== 'string' || !isUuid(value)) {
      throw new BadRequestException(
        `Validation failed for '${metadata.data}' (invalid UUID string is provided)`,
      );
    }
    return value;
  }
}
