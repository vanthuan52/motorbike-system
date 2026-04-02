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
import { DatabaseIdDto } from '@/common/database/dtos/database.id.dto';
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
  AppointmentAdminParamsIdDoc,
  AppointmentAdminListDoc,
  AppointmentAdminUpdateDoc,
  AppointmentAdminUpdateStatusDoc,
  AppointmentAdminTrashListDoc,
  AppointmentAdminRestoreDoc,
  AppointmentAdminForceDeleteDoc,
} from '../docs/appointment.admin.doc';
import { AppointmentService } from '../services/appointment.service';
import { AppointmentCreateRequestDto } from '../dtos/request/appointment.create.request.dto';
import { AppointmentUpdateRequestDto } from '../dtos/request/appointment.update.request.dto';
import { AppointmentUpdateStatusRequestDto } from '../dtos/request/appointment.update-status.request.dto';
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
import { AppointmentListResponseDto } from '../dtos/response/appointment.list.response.dto';
import { AppointmentGetFullResponseDto } from '../dtos/response/appointment.full.response.dto';
import { ActivityLog } from '@/modules/activity-log/decorators/activity-log.decorator';
import { EnumActivityLogAction } from '@/modules/activity-log/enums/activity-log.enum';
import { Prisma } from '@/generated/prisma-client';
import {
  AppointmentDefaultAvailableSearch,
  AppointmentDefaultStatus,
} from '../constants/appointment.list.constant';

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
      availableSearch: AppointmentDefaultAvailableSearch,
    })
    pagination: IPaginationQueryOffsetParams<
      Prisma.AppointmentSelect,
      Prisma.AppointmentWhereInput
    >,
    @PaginationQueryFilterInEnum('status', AppointmentDefaultStatus)
    status?: Record<string, IPaginationIn>,
    @PaginationQueryFilterEqualBoolean('isActive')
    isActive?: Record<string, IPaginationEqual>
  ): Promise<IResponsePagingReturn<AppointmentListResponseDto>> {
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

  @AppointmentAdminParamsIdDoc()
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
  ): Promise<IResponseReturn<AppointmentGetFullResponseDto>> {
    const appointment = await this.appointmentService.findOneById(id);
    const mapped = this.appointmentUtil.mapGetPopulate(appointment);
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
  @ActivityLog(EnumActivityLogAction.adminAppointmentCreate)
  @Post('/create')
  async create(
    @Body() body: AppointmentCreateRequestDto,
    @AuthJwtPayload('userId') userId: string,
    @RequestIPAddress() ipAddress: string,
    @RequestUserAgent() userAgent: UserAgent,
    @RequestGeoLocation() geoLocation: GeoLocation | null
  ): Promise<IResponseReturn<DatabaseIdDto>> {
    const data = await this.appointmentService.create(
      body,
      { ipAddress, userAgent, geoLocation },
      userId
    );
    return {
      data: { id: data.id },
      metadataActivityLog: this.appointmentUtil.mapActivityLogMetadata(data),
    };
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
  @ActivityLog(EnumActivityLogAction.adminAppointmentUpdate)
  @Put('/update/:id')
  async update(
    @Param('id') id: string,
    @Body() body: AppointmentUpdateRequestDto,
    @AuthJwtPayload('userId') userId: string,
    @RequestIPAddress() ipAddress: string,
    @RequestUserAgent() userAgent: UserAgent,
    @RequestGeoLocation() geoLocation: GeoLocation | null
  ): Promise<IResponseReturn<void>> {
    const data = await this.appointmentService.update(
      id,
      body,
      { ipAddress, userAgent, geoLocation },
      userId
    );
    return {
      metadataActivityLog: this.appointmentUtil.mapActivityLogMetadata(data),
    };
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
  @ActivityLog(EnumActivityLogAction.adminAppointmentUpdateStatus)
  @Patch('/update/:id/status')
  async updateStatus(
    @Param('id') id: string,
    @Body() body: AppointmentUpdateStatusRequestDto,
    @AuthJwtPayload('userId') userId: string,
    @RequestIPAddress() ipAddress: string,
    @RequestUserAgent() userAgent: UserAgent,
    @RequestGeoLocation() geoLocation: GeoLocation | null
  ): Promise<IResponseReturn<void>> {
    const data = await this.appointmentService.updateStatus(
      id,
      body,
      { ipAddress, userAgent, geoLocation },
      userId
    );
    return {
      metadataActivityLog: this.appointmentUtil.mapActivityLogMetadata(data),
    };
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
  @ActivityLog(EnumActivityLogAction.adminAppointmentDelete)
  @Delete('/delete/:id')
  async delete(
    @Param('id') id: string,
    @AuthJwtPayload('userId') userId: string,
    @RequestIPAddress() ipAddress: string,
    @RequestUserAgent() userAgent: UserAgent,
    @RequestGeoLocation() geoLocation: GeoLocation | null
  ): Promise<IResponseReturn<void>> {
    const data = await this.appointmentService.delete(
      id,
      { ipAddress, userAgent, geoLocation },
      userId
    );
    return {
      metadataActivityLog: this.appointmentUtil.mapActivityLogMetadata(data),
    };
  }

  // === Trash/Restore ===

  @AppointmentAdminTrashListDoc()
  @ResponsePaging('appointment.trashList')
  @PolicyAbilityProtected({
    subject: EnumPolicySubject.appointment,
    action: [EnumPolicyAction.read],
  })
  @RoleProtected('admin')
  @UserProtected()
  @AuthJwtAccessProtected()
  @Get('/trash')
  async trashList(
    @PaginationOffsetQuery({
      availableSearch: ['code', 'customerName', 'customerPhone'],
    })
    pagination: IPaginationQueryOffsetParams<
      Prisma.AppointmentSelect,
      Prisma.AppointmentWhereInput
    >
  ): Promise<IResponsePagingReturn<AppointmentListResponseDto>> {
    const result = await this.appointmentService.getTrashList(pagination);
    const mapped = this.appointmentUtil.mapList(result.data);
    return {
      ...result,
      data: mapped,
    };
  }

  @AppointmentAdminRestoreDoc()
  @Response('appointment.restore')
  @PolicyAbilityProtected({
    subject: EnumPolicySubject.appointment,
    action: [EnumPolicyAction.update],
  })
  @RoleProtected('admin')
  @UserProtected()
  @AuthJwtAccessProtected()
  @ActivityLog(EnumActivityLogAction.adminAppointmentRestore)
  @Post('/restore/:id')
  async restore(
    @Param('id') id: string,
    @AuthJwtPayload('userId') restoredBy: string,
    @RequestIPAddress() ipAddress: string,
    @RequestUserAgent() userAgent: UserAgent,
    @RequestGeoLocation() geoLocation: GeoLocation | null
  ): Promise<IResponseReturn<void>> {
    const data = await this.appointmentService.restore(
      id,
      { ipAddress, userAgent, geoLocation },
      restoredBy
    );
    return {
      metadataActivityLog: this.appointmentUtil.mapActivityLogMetadata(data),
    };
  }

  @AppointmentAdminForceDeleteDoc()
  @Response('appointment.forceDelete')
  @PolicyAbilityProtected({
    subject: EnumPolicySubject.appointment,
    action: [EnumPolicyAction.delete],
  })
  @RoleProtected('admin')
  @UserProtected()
  @AuthJwtAccessProtected()
  @ActivityLog(EnumActivityLogAction.adminAppointmentForceDelete)
  @Delete('/force-delete/:id')
  async forceDelete(
    @Param('id') id: string,
    @AuthJwtPayload('userId') deletedBy: string,
    @RequestIPAddress() ipAddress: string,
    @RequestUserAgent() userAgent: UserAgent,
    @RequestGeoLocation() geoLocation: GeoLocation | null
  ): Promise<IResponseReturn<void>> {
    const data = await this.appointmentService.forceDelete(
      id,
      { ipAddress, userAgent, geoLocation },
      deletedBy
    );
    return {
      metadataActivityLog: this.appointmentUtil.mapActivityLogMetadata(data),
    };
  }
}
