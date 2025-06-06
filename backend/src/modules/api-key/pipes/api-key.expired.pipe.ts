import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import { ENUM_API_KEY_STATUS_CODE_ERROR } from '../enums/api-key.status-code.enum';
import { HelperDateService } from '@/common/helper/services/helper.date.service';

@Injectable()
export class ApiKeyNotExpiredPipe implements PipeTransform {
  constructor(private readonly helperDateService: HelperDateService) {}

  async transform(value: any) {
    const today: Date = this.helperDateService.create();

    if (value.startDate && value.endDate && today > value.endDate) {
      throw new BadRequestException({
        statusCode: ENUM_API_KEY_STATUS_CODE_ERROR.EXPIRED,
        message: 'apiKey.error.expired',
      });
    }

    return value;
  }
}
