import {
  Injectable,
  BadRequestException,
  PipeTransform,
  ArgumentMetadata,
} from '@nestjs/common';

@Injectable()
export class RequestRequiredPipe implements PipeTransform {
  async transform(value: any): Promise<string> {
    if (!value) {
      throw new BadRequestException();
    }

    return value;
  }
}
