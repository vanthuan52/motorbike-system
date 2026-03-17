import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AppointmentService } from '../services/appointment.service';
import { AppointmentsPublicCreateDoc } from '../docs/appointment.public.doc';
import { Response } from '@/common/response/decorators/response.decorator';
import { AppointmentBookRequestDto } from '../dtos/request/appointment.book.request.dto';
import { IResponseReturn } from '@/common/response/interfaces/response.interface';
import { DatabaseIdDto } from '@/common/database/dtos/database.id.response.dto';

@ApiTags('modules.public.appointment')
@Controller({
  version: '1',
  path: '/appointment',
})
export class AppointmentPublicController {
  constructor(private readonly appointmentService: AppointmentService) {}

  @AppointmentsPublicCreateDoc()
  @Response('appointment.create')
  @Post('/create')
  async create(
    @Body() body: AppointmentBookRequestDto,
  ): Promise<IResponseReturn<DatabaseIdDto>> {
    const created = await this.appointmentService.createAppointment(body);
    return { data: { _id: created._id } };
  }
}
