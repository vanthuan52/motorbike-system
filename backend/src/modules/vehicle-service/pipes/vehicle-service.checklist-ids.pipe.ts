import {
  PipeTransform,
  Injectable,
  BadRequestException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { isUUID } from 'class-validator';
import { ServiceChecklistService } from '@/modules/service-checklist/services/service-checklist.service';
import { ENUM_VEHICLE_SERVICE_STATUS_CODE_ERROR } from '../enums/vehicle-service.status-code.enum';

@Injectable()
export class VehicleServiceChecklistIdsPipe implements PipeTransform {
  private readonly logger = new Logger(VehicleServiceChecklistIdsPipe.name);
  constructor(private readonly checklistService: ServiceChecklistService) {}

  async transform(value: string[]): Promise<string[]> {
    if (!Array.isArray(value)) {
      throw new BadRequestException({
        statusCode: ENUM_VEHICLE_SERVICE_STATUS_CODE_ERROR.NOT_FOUND,
        message: 'service-checklist.error.notFound',
      });
    }
    const uniqueIds = [...new Set(value)];

    const allValid = uniqueIds.every((id) => isUUID(id));
    if (!allValid) {
      throw new BadRequestException({
        statusCode: HttpStatus.BAD_REQUEST,
        message: 'service-checklist.error.invalidId',
      });
    }

    const found = await this.checklistService.getTotal({
      _id: { $in: uniqueIds },
    });

    if (found !== uniqueIds.length) {
      throw new BadRequestException({
        statusCode: ENUM_VEHICLE_SERVICE_STATUS_CODE_ERROR.NOT_FOUND,
        message: 'service-checklist.error.inconsistenceId',
      });
    }

    return uniqueIds;
  }
}
