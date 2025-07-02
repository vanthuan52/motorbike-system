import { Injectable, NotFoundException, PipeTransform } from '@nestjs/common';
import { PartService } from '../services/part.services';
import { ENUM_PART_STATUS_CODE_ERROR } from '../enums/part.status-code.enum';
import { PartDoc } from '../entities/part.entity';

@Injectable()
export class PartParsePipe implements PipeTransform {
  constructor(private readonly partService: PartService) {}

  async transform(value: any): Promise<PartDoc> {
    const part: PartDoc | null = await this.partService.findOneById(value);

    if (!part) {
      throw new NotFoundException({
        statusCode: ENUM_PART_STATUS_CODE_ERROR.NOT_FOUND,
        message: 'part.error.notFound',
      });
    }

    return part;
  }
}

@Injectable()
export class PartActiveParsePipe implements PipeTransform {
  constructor(private readonly partService: PartService) {}

  async transform(value: any) {
    const part = await this.partService.findOneWithPartById(value);

    if (!part) {
      throw new NotFoundException({
        statusCode: ENUM_PART_STATUS_CODE_ERROR.NOT_FOUND,
        message: 'part.error.notFound',
      });
    }

    return part;
  }
}
