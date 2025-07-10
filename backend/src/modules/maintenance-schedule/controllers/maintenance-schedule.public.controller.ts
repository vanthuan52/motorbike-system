import {
  Body,
  Controller,
  InternalServerErrorException,
  NotFoundException,
  Post,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { MaintenanceScheduleService } from '../services/maintenance-schedule.service';
import { UserService } from '@/modules/user/services/user.service';
import { VehicleBrandService } from '@/modules/vehicle-brand/services/vehicle-brand.service';
import { VehicleModelService } from '@/modules/vehicle-model/services/vehicle-model.service';
import { ServiceCategoryService } from '@/modules/service-category/services/service-category.services';
import { MaintenanceSchedulePublicCreateDoc } from '../docs/maintenance-schedule.public.doc';
import { Response } from '@/common/response/decorators/response.decorator';
import { MaintenanceScheduleCreateRequestPublicDto } from '../dtos/request/maintenance-schedule.create.request.public.dto';
import { ENUM_VEHICLE_BRAND_STATUS_CODE_ERROR } from '@/modules/vehicle-brand/enums/vehicle-brand.status-code.enum';
import { ENUM_VEHICLE_MODEL_STATUS_CODE_ERROR } from '@/modules/vehicle-model/enums/vehicle-model.status-code.enum';
import { ENUM_APP_STATUS_CODE_ERROR } from '@/app/enums/app.status-code.num';

@ApiTags('modules.public.maintenance-schedule')
@Controller({
  version: '1',
  path: '/maintenance-schedule',
})
export class MaintenanceSchedulePublicController {
  constructor(
    private readonly maintenanceScheduleService: MaintenanceScheduleService,
    private readonly userService: UserService,
    private readonly vehicleBrandService: VehicleBrandService,
    private readonly vehicleModelService: VehicleModelService,
    private readonly serviceCategoryService: ServiceCategoryService,
  ) {}

  @MaintenanceSchedulePublicCreateDoc()
  @Response('maintenance-schedule.create')
  @Post('/create')
  async create(
    @Body() body: MaintenanceScheduleCreateRequestPublicDto,
  ): Promise<any> {
    const promises: Promise<any>[] = [
      this.vehicleBrandService.findOneById(body.vehicleBrand),
      this.vehicleModelService.findOneById(body.vehicleModel),
    ];
    const [existingVehicleBrand, existingVehicleModel] =
      await Promise.all(promises);

    if (!existingVehicleBrand) {
      throw new NotFoundException({
        statusCode: ENUM_VEHICLE_BRAND_STATUS_CODE_ERROR.NOT_FOUND,
        message: 'vehicle-brand.error.notFound',
      });
    }

    if (!existingVehicleModel) {
      throw new NotFoundException({
        statusCode: ENUM_VEHICLE_MODEL_STATUS_CODE_ERROR.NOT_FOUND,
        message: 'vehicle-model.error.notFound',
      });
    }

    for (const categoryId of body.serviceCategory) {
      const existing =
        await this.serviceCategoryService.findOneById(categoryId);
      if (!existing) {
        throw new NotFoundException({
          message: 'service-category.error.notFound',
        });
      }
    }
    try {
      const created = await this.maintenanceScheduleService.create(body);
      return { data: created };
    } catch (err) {
      throw new InternalServerErrorException({
        statusCode: ENUM_APP_STATUS_CODE_ERROR.UNKNOWN,
        message: 'http.serverError.internalServerError',
        _error: err,
      });
    }
  }
}
