import {
  Body,
  Controller,
  InternalServerErrorException,
  NotFoundException,
  Post,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AppointmentService } from '../services/appointment.service';
import { VehicleModelService } from '@/modules/vehicle-model/services/vehicle-model.service';
import { AppointmentsPublicCreateDoc } from '../docs/appointment.public.doc';
import { Response } from '@/common/response/decorators/response.decorator';
import { AppointmentCreateRequestPublicDto } from '../dtos/request/appointment.create.request.public.dto';
import { ENUM_VEHICLE_BRAND_STATUS_CODE_ERROR } from '@/modules/vehicle-brand/enums/vehicle-brand.status-code.enum';
import { ENUM_VEHICLE_MODEL_STATUS_CODE_ERROR } from '@/modules/vehicle-model/enums/vehicle-model.status-code.enum';
import { ENUM_APP_STATUS_CODE_ERROR } from '@/app/enums/app.status-code.num';
import { UserVehicleService } from '@/modules/user-vehicle/services/user-vehicle.service';
import { VehicleServiceService } from '@/modules/vehicle-service/services/vehicle-service.service';
import { ENUM_VEHICLE_SERVICE_STATUS_CODE_ERROR } from '@/modules/vehicle-service/enums/vehicle-service.status-code.enum';

@ApiTags('modules.public.appointment')
@Controller({
  version: '1',
  path: '/appointment',
})
export class AppointmentsPublicController {
  constructor(
    private readonly appointmentService: AppointmentService,
    private readonly vehicleModelService: VehicleModelService,
    private readonly vehileServiceService: VehicleServiceService,
    private readonly userVehicleService: UserVehicleService,
  ) {}

  @AppointmentsPublicCreateDoc()
  @Response('appointment.create')
  @Post('/create')
  async create(@Body() body: AppointmentCreateRequestPublicDto): Promise<any> {
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
        const service = await this.vehileServiceService.findOneById(id);
        if (!service) {
          throw new NotFoundException({
            statusCode: ENUM_VEHICLE_SERVICE_STATUS_CODE_ERROR.NOT_FOUND,
            message: 'vehicle-service.error.notFound',
          });
        }
      }),
    );
    try {
      const created = await this.appointmentService.createAppointment(body);
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
