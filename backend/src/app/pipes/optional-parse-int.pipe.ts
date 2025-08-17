import { PipeTransform, Injectable, ArgumentMetadata } from '@nestjs/common';

@Injectable()
export class OptionalParseIntPipe implements PipeTransform {
  // @ts-ignore
  transform(value: any, metadata: ArgumentMetadata) {
    if (value === undefined || value === null || value === '') {
      return undefined;
    }
    const val = parseInt(value, 10);
    if (isNaN(val)) {
      throw new Error(`Validation failed (numeric string is expected)`);
    }
    return val;
  }
}
