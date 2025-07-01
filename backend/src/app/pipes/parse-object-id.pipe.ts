import {
  ArgumentMetadata,
  Injectable,
  PipeTransform,
  BadRequestException,
} from '@nestjs/common';
import { Types } from 'mongoose';

@Injectable()
export class ParseObjectIdPipe implements PipeTransform<any, Types.ObjectId> {
  transform(value: any, metadata: ArgumentMetadata): Types.ObjectId {
    if (!value) {
      return value;
    }

    if (Types.ObjectId.isValid(value)) {
      return new Types.ObjectId(value);
    } else {
      throw new BadRequestException(
        `Validation failed (invalid ObjectId string is provided for ${metadata.data})`,
      );
    }
  }
}
