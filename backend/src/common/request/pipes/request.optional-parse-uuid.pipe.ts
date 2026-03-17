import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common';
import { ParseUUIDPipe } from '@nestjs/common';

@Injectable()
export class RequestOptionalParseUUIDPipe implements PipeTransform {
  async transform(
    value: string,
    metadata: ArgumentMetadata,
  ): Promise<string | undefined> {
    if (!value) {
      return undefined;
    }
    return new ParseUUIDPipe().transform(value, metadata);
  }
}
