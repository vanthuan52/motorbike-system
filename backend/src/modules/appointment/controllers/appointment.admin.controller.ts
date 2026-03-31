import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Put,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import {
  PaginationOffsetQuery,
  PaginationQueryFilterEqualBoolean,
  PaginationQueryFilterInEnum,
} from '@/common/pagination/decorators/pagination.decorator';
import {
  Response,
  ResponsePaging,
} from '@/common/response/decorators/response.decorator';
import {
  IResponsePagingReturn,
  IResponseReturn,
} from '@/common/response/interfaces/response.interface';
import {
  AuthJwtAccessProtected,
  AuthJwtPayload,
} from '@/modules/auth/decorators/auth.jwt.decorator';
import { PolicyAbilityProtected } from '@/modules/policy/decorators/policy.decorator';
import {
  EnumPolicyAction,
  EnumPolicySubject,
} from '@/modules/policy/enums/policy.enum';
import { RoleProtected } from '@/modules/role/decorators/role.decorator';
import { UserProtected } from '@/modules/user/decorators/user.decorator';
import {
  AppointmentAdminCreateDoc,
  AppointmentAdminDeleteDoc,
  AppointmentAdminGetDoc,
  AppointmentAdminListDoc,
  AppointmentAdminUpdateDoc,
  AppointmentAdminUpdateStatusDoc,
} from '../docs/appointment.admin.doc';
import { AppointmentService } from '../services/appointment.service';
import { AppointmentCreateRequestDto } from '../dtos/request/appointment.create.request.dto';
import { AppointmentUpdateRequestDto } from '../dtos/request/appointment.update.request.dto';
import { AppointmentUpdateStatusRequestDto } from '../dtos/request/appointment.update-status.request.dto';
import { AppointmentResponseDto } from '../dtos/response/appointment.response.dto';
import { AppointmentUtil } from '../utils/appointment.util';
import {
  IPaginationEqual,
  IPaginationIn,
  IPaginationQueryOffsetParams,
} from '@/common/pagination/interfaces/pagination.interface';
import {
  RequestGeoLocation,
  RequestIPAddress,
  RequestUserAgent,
} from '@/common/request/decorators/request.decorator';
import {
  GeoLocation,
  UserAgent,
} from '@/modules/user/interfaces/user.interface';
import { Prisma } from '@/generated/prisma-client';

@ApiTags('modules.admin.appointment')
@Controller({
  version: '1',
  path: '/appointment',
})
export class AppointmentAdminController {
  constructor(
    private readonly appointmentService: AppointmentService,
    private readonly appointmentUtil: AppointmentUtil
  ) {}

  @AppointmentAdminListDoc()
  @ResponsePaging('appointment.list')
  @PolicyAbilityProtected({
    subject: EnumPolicySubject.appointment,
    action: [EnumPolicyAction.read],
  })
  @RoleProtected('admin', 'user')
  @UserProtected()
  @AuthJwtAccessProtected()
  @Get('/list')
  async list(
    @PaginationOffsetQuery({
      availableSearch: ['code', 'customerName', 'customerPhone'],
    })
    pagination: IPaginationQueryOffsetParams<
      Prisma.AppointmentSelect,
      Prisma.AppointmentWhereInput
    >,
    @PaginationQueryFilterInEnum('status', [
      'PENDING',
      'CONFIRMED',
      'CANCELLED',
      'COMPLETED',
    ])
    status?: Record<string, IPaginationIn>,
    @PaginationQueryFilterEqualBoolean('isActive')
    isActive?: Record<string, IPaginationEqual>
  ): Promise<IResponsePagingReturn<AppointmentResponseDto>> {
    const result = await this.appointmentService.getListOffset(pagination, {
      ...status,
      ...isActive,
    });
    const mapped = this.appointmentUtil.mapList(result.data);
    return {
      ...result,
      data: mapped,
    };
  }

  @AppointmentAdminGetDoc()
  @Response('appointment.get')
  @PolicyAbilityProtected({
    subject: EnumPolicySubject.appointment,
    action: [EnumPolicyAction.read],
  })
  @RoleProtected('admin', 'user')
  @UserProtected()
  @AuthJwtAccessProtected()
  @Get('/get/:id')
  async get(
    @Param('id') id: string
  ): Promise<IResponseReturn<AppointmentResponseDto>> {
    const appointment = await this.appointmentService.findOneById(id);
    const mapped = this.appointmentUtil.mapOne(appointment);
    return { data: mapped };
  }

  @AppointmentAdminCreateDoc()
  @Response('appointment.create')
  @PolicyAbilityProtected({
    subject: EnumPolicySubject.appointment,
    action: [EnumPolicyAction.create],
  })
  @RoleProtected('admin')
  @UserProtected()
  @AuthJwtAccessProtected()
  @Post('/create')
  async create(
    @Body() body: AppointmentCreateRequestDto,
    @AuthJwtPayload('userId') userId: string,
    @RequestIPAddress() ipAddress: string,
    @RequestUserAgent() userAgent: UserAgent,
    @RequestGeoLocation() geoLocation: GeoLocation | null
  ): Promise<IResponseReturn<{ id: string }>> {
    const created = await this.appointmentService.createByAdmin(
      body,
      { ipAddress, userAgent, geoLocation },
      userId
    );
    return { data: { id: created._id } };
  }

  @AppointmentAdminUpdateDoc()
  @Response('appointment.update')
  @PolicyAbilityProtected({
    subject: EnumPolicySubject.appointment,
    action: [EnumPolicyAction.update],
  })
  @RoleProtected('admin')
  @UserProtected()
  @AuthJwtAccessProtected()
  @Put('/update/:id')
  async update(
    @Param('id') id: string,
    @Body() body: AppointmentUpdateRequestDto,
    @AuthJwtPayload('userId') userId: string,
    @RequestIPAddress() ipAddress: string,
    @RequestUserAgent() userAgent: UserAgent,
    @RequestGeoLocation() geoLocation: GeoLocation | null
  ): Promise<IResponseReturn<void>> {
    await this.appointmentService.updateByAdmin(
      id,
      body,
      { ipAddress, userAgent, geoLocation },
      userId
    );
    return {};
  }

  @AppointmentAdminUpdateStatusDoc()
  @Response('appointment.updateStatus')
  @PolicyAbilityProtected({
    subject: EnumPolicySubject.appointment,
    action: [EnumPolicyAction.update],
  })
  @RoleProtected('admin')
  @UserProtected()
  @AuthJwtAccessProtected()
  @Patch('/update/:id/status')
  async updateStatus(
    @Param('id') id: string,
    @Body() body: AppointmentUpdateStatusRequestDto,
    @AuthJwtPayload('userId') userId: string,
    @RequestIPAddress() ipAddress: string,
    @RequestUserAgent() userAgent: UserAgent,
    @RequestGeoLocation() geoLocation: GeoLocation | null
  ): Promise<IResponseReturn<void>> {
    await this.appointmentService.updateStatusByAdmin(
      id,
      body,
      { ipAddress, userAgent, geoLocation },
      userId
    );
    return {};
  }

  @AppointmentAdminDeleteDoc()
  @Response('appointment.delete')
  @PolicyAbilityProtected({
    subject: EnumPolicySubject.appointment,
    action: [EnumPolicyAction.delete],
  })
  @RoleProtected('admin')
  @UserProtected()
  @AuthJwtAccessProtected()
  @Delete('/delete/:id')
  async delete(
    @Param('id') id: string,
    @AuthJwtPayload('userId') userId: string,
    @RequestIPAddress() ipAddress: string,
    @RequestUserAgent() userAgent: UserAgent,
    @RequestGeoLocation() geoLocation: GeoLocation | null
  ): Promise<IResponseReturn<void>> {
    await this.appointmentService.deleteByAdmin(
      id,
      { ipAddress, userAgent, geoLocation },
      userId
    );
    return {};
  }
}
