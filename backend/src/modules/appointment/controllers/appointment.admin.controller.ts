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
import { AppointmentService } from '../services/appointment.service';
import {
  AppointmentAdminCreateDoc,
  AppointmentAdminDeleteDoc,
  AppointmentAdminListDoc,
  AppointmentAdminParamsIdDoc,
  AppointmentAdminUpdateDoc,
  AppointmentAdminUpdateStatusDoc,
} from '../docs/appointment.admin.doc';
import {
  Response,
  ResponsePaging,
} from '@/common/response/decorators/response.decorator';
import { PolicyAbilityProtected } from '@/modules/policy/decorators/policy.decorator';
import {
  EnumPolicyAction,
  EnumPolicySubject,
} from '@/modules/policy/enums/policy.enum';
import { UserProtected } from '@/modules/user/decorators/user.decorator';
import {
  AuthJwtAccessProtected,
  AuthJwtPayload,
} from '@/modules/auth/decorators/auth.jwt.decorator';
import {
  PaginationOffsetQuery,
  PaginationQueryFilterInEnum,
} from '@/common/pagination/decorators/pagination.decorator';
import {
  APPOINTMENTS_DEFAULT_AVAILABLE_ORDER_BY,
  APPOINTMENTS_DEFAULT_AVAILABLE_SEARCH,
  APPOINTMENTS_DEFAULT_STATUS,
} from '../constants/appointment.list.constant';
import {
  IPaginationQueryOffsetParams,
  IPaginationIn,
} from '@/common/pagination/interfaces/pagination.interface';
import {
  IResponseReturn,
  IResponsePagingReturn,
} from '@/common/response/interfaces/response.interface';
import { AppointmentListResponseDto } from '../dtos/response/appointment.list.response.dto';
import { AppointmentCreateRequestDto } from '../dtos/request/appointment.create.request.dto';
import { AppointmentUpdateStatusRequestDto } from '../dtos/request/appointment.update-status.request.dto';
import { AppointmentUpdateRequestDto } from '../dtos/request/appointment.update.request.dto';
import { RequestRequiredPipe } from '@/common/request/pipes/request.required.pipe';
import { RoleProtected } from '@/modules/role/decorators/role.decorator';
import { AppointmentGetFullResponseDto } from '../dtos/response/appointment.full.response.dto';
import { AppointmentUtil } from '../utils/appointment.util';
import { EnumRoleType } from '@/modules/role/enums/role.enum';
import { DatabaseIdDto } from '@/common/database/dtos/database.id.dto';
import { RequestIsValidObjectIdPipe } from '@/common/request/pipes/request.is-valid-object-id.pipe';
import {
  RequestGeoLocation,
  RequestIPAddress,
  RequestUserAgent,
} from '@/common/request/decorators/request.decorator';
import {
  GeoLocation,
  UserAgent,
} from '@/modules/user/interfaces/user.interface';

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
    subject: EnumPolicySubject.user,
    action: [EnumPolicyAction.read],
  })
  @RoleProtected(EnumRoleType.admin)
  @UserProtected()
  @AuthJwtAccessProtected()
  @Get('/list')
  async list(
    @PaginationOffsetQuery({
      availableSearch: APPOINTMENTS_DEFAULT_AVAILABLE_SEARCH,
      availableOrderBy: APPOINTMENTS_DEFAULT_AVAILABLE_ORDER_BY,
    })
    pagination: IPaginationQueryOffsetParams,
    @PaginationQueryFilterInEnum('status', APPOINTMENTS_DEFAULT_STATUS)
    status: Record<string, IPaginationIn>
  ): Promise<IResponsePagingReturn<AppointmentListResponseDto>> {
    const result = await this.appointmentService.getListOffset(
      pagination,
      status
    );
    const mapped = this.appointmentUtil.mapList(result.data);
    return {
      ...result,
      data: mapped,
    };
  }

  @AppointmentAdminParamsIdDoc()
  @Response('appointment.getById')
  @PolicyAbilityProtected({
    subject: EnumPolicySubject.user,
    action: [EnumPolicyAction.read],
  })
  @RoleProtected(EnumRoleType.admin)
  @UserProtected()
  @AuthJwtAccessProtected()
  @Get('/get/:id')
  async get(
    @Param('id', RequestRequiredPipe, RequestIsValidObjectIdPipe) id: string
  ): Promise<IResponseReturn<AppointmentGetFullResponseDto>> {
    const appointment =
      await this.appointmentService.findOneWithRelationsById(id);
    const mapped = this.appointmentUtil.mapGetPopulate(appointment);
    return { data: mapped };
  }

  @AppointmentAdminCreateDoc()
  @Response('appointment.create')
  @PolicyAbilityProtected({
    subject: EnumPolicySubject.user,
    action: [EnumPolicyAction.read],
  })
  @RoleProtected(EnumRoleType.admin)
  @UserProtected()
  @AuthJwtAccessProtected()
  @Post('/create')
  async create(
    @AuthJwtPayload('userId') userId: string,
    @RequestIPAddress() ipAddress: string,
    @RequestUserAgent() userAgent: UserAgent,
    @RequestGeoLocation() geoLocation: GeoLocation | null,
    @Body() body: AppointmentCreateRequestDto
  ): Promise<IResponseReturn<DatabaseIdDto>> {
    const created = await this.appointmentService.create(
      body,
      { ipAddress, userAgent, geoLocation },
      userId
    );
    return { data: { id: created._id } };
  }

  @AppointmentAdminUpdateDoc()
  @Response('appointment.update')
  @PolicyAbilityProtected({
    subject: EnumPolicySubject.user,
    action: [EnumPolicyAction.read],
  })
  @RoleProtected(EnumRoleType.admin, EnumRoleType.user)
  @UserProtected()
  @AuthJwtAccessProtected()
  @Put('/update/:id')
  async update(
    @Param('id', RequestRequiredPipe) id: string,
    @AuthJwtPayload('userId') userId: string,
    @RequestIPAddress() ipAddress: string,
    @RequestUserAgent() userAgent: UserAgent,
    @RequestGeoLocation() geoLocation: GeoLocation | null,
    @Body() body: AppointmentUpdateRequestDto
  ): Promise<IResponseReturn<void>> {
    await this.appointmentService.update(
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
    subject: EnumPolicySubject.user,
    action: [EnumPolicyAction.read],
  })
  @RoleProtected(EnumRoleType.admin)
  @UserProtected()
  @AuthJwtAccessProtected()
  @Patch('/update/:id/status')
  async updateStatus(
    @Param('id', RequestRequiredPipe, RequestIsValidObjectIdPipe) id: string,
    @AuthJwtPayload('userId') userId: string,
    @RequestIPAddress() ipAddress: string,
    @RequestUserAgent() userAgent: UserAgent,
    @RequestGeoLocation() geoLocation: GeoLocation | null,
    @Body() body: AppointmentUpdateStatusRequestDto
  ): Promise<IResponseReturn<void>> {
    await this.appointmentService.updateStatus(
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
    subject: EnumPolicySubject.user,
    action: [EnumPolicyAction.read],
  })
  @RoleProtected(EnumRoleType.admin)
  @UserProtected()
  @AuthJwtAccessProtected()
  @Delete('/delete/:id')
  async delete(
    @Param('id', RequestRequiredPipe, RequestIsValidObjectIdPipe) id: string,
    @AuthJwtPayload('userId') userId: string,
    @RequestIPAddress() ipAddress: string,
    @RequestUserAgent() userAgent: UserAgent,
    @RequestGeoLocation() geoLocation: GeoLocation | null
  ): Promise<IResponseReturn<void>> {
    await this.appointmentService.delete(
      id,
      { ipAddress, userAgent, geoLocation },
      userId
    );
    return {};
  }
}
