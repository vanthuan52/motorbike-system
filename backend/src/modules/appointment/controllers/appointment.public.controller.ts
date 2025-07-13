import {
  Body,
  Controller,
  InternalServerErrorException,
  NotFoundException,
  Post,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AppointmentsService } from '../services/appointment.service';
import { VehicleBrandService } from '@/modules/vehicle-brand/services/vehicle-brand.service';
import { VehicleModelService } from '@/modules/vehicle-model/services/vehicle-model.service';
import { ServiceCategoryService } from '@/modules/service-category/services/service-category.services';
import { AppointmentsPublicCreateDoc } from '../docs/appointment.public.doc';
import { Response } from '@/common/response/decorators/response.decorator';
import { AppointmentsCreateRequestPublicDto } from '../dtos/request/appointment.create.request.public.dto';
import { ENUM_VEHICLE_BRAND_STATUS_CODE_ERROR } from '@/modules/vehicle-brand/enums/vehicle-brand.status-code.enum';
import { ENUM_VEHICLE_MODEL_STATUS_CODE_ERROR } from '@/modules/vehicle-model/enums/vehicle-model.status-code.enum';
import { ENUM_APP_STATUS_CODE_ERROR } from '@/app/enums/app.status-code.num';
import { UserVehicleService } from '@/modules/user-vehicle/services/user-vehicle.service';
import { ENUM_SERVICE_CATEGORY_STATUS_CODE_ERROR } from '@/modules/service-category/enums/service-category.status-code.enum';

@ApiTags('modules.public.appointment')
@Controller({
  version: '1',
  path: '/appointment',
})
export class AppointmentsPublicController {
  constructor(
    private readonly appointmentsService: AppointmentsService,
    private readonly vehicleBrandService: VehicleBrandService,
    private readonly vehicleModelService: VehicleModelService,
    private readonly serviceCategoryService: ServiceCategoryService,
    private readonly userVehicleService: UserVehicleService,
  ) {}

  @AppointmentsPublicCreateDoc()
  @Response('appointment.create')
  @Post('/create')
  async create(@Body() body: AppointmentsCreateRequestPublicDto): Promise<any> {
    const { userVehicle, vehicleModel, vehicleServices } = body;
    const foundVehicleModel =
      await this.vehicleModelService.findOneById(vehicleModel);
    if (!foundVehicleModel) {
      throw new NotFoundException({
        statusCode: ENUM_VEHICLE_MODEL_STATUS_CODE_ERROR.NOT_FOUND,
        message: 'vehicle-model.error.notFound',
      });
    }

    if (userVehicle) {
      const foundUserVehicle =
        await this.userVehicleService.findOneById(userVehicle);
      if (!foundUserVehicle) {
        throw new NotFoundException({
          statusCode: ENUM_VEHICLE_BRAND_STATUS_CODE_ERROR.NOT_FOUND,
          message: 'vehicle-brand.error.notFound',
        });
      }
    }

    await Promise.all(
      vehicleServices.map(async (id) => {
        const service = await this.serviceCategoryService.findOneById(id);
        if (!service) {
          throw new NotFoundException({
            statusCode: ENUM_SERVICE_CATEGORY_STATUS_CODE_ERROR.NOT_FOUND,
            message: 'service-category.error.notFound',
          });
        }
      }),
    );
    try {
      const created = await this.appointmentsService.create(body);
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
