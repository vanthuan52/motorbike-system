import {
  Body,
  Controller,
  Get,
  Post,
  Put,
  Patch,
  Delete,
  Param,
  Query,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CareRecordService } from '../services/care-record.service';
import { CareRecordCreateRequestDto } from '../dtos/request/care-record.create.request.dto';
import { CareRecordUpdateRequestDto } from '../dtos/request/care-record.update.request.dto';
import {
  Response,
  ResponsePaging,
} from '@/common/response/decorators/response.decorator';
import {
  IResponseReturn,
  IResponsePagingReturn,
} from '@/common/response/interfaces/response.interface';
import { CareRecordListResponseDto } from '../dtos/response/care-record.list.response.dto';
import { CareRecordGetFullResponseDto } from '../dtos/response/care-record.full.response.dto';
import {
  PaginationOffsetQuery,
  PaginationQueryFilterInEnum,
} from '@/common/pagination/decorators/pagination.decorator';
import {
  IPaginationQueryOffsetParams,
  IPaginationIn,
} from '@/common/pagination/interfaces/pagination.interface';
import {
  CareRecordAdminCreateChecklistDoc,
  CareRecordAdminCreateDoc,
  CareRecordAdminDeleteDoc,
  CareRecordAdminListDoc,
  CareRecordAdminParamsIdDoc,
  CareRecordAdminUpdateDoc,
  CareRecordAdminUpdatePaymentStatusDoc,
  CareRecordAdminUpdateStatusDoc,
  CareRecordAdminUpdateTechnicianDoc,
  CareRecordAdminTrashListDoc,
  CareRecordAdminRestoreDoc,
  CareRecordAdminForceDeleteDoc,
} from '../docs/care-record.admin.doc';
import { DatabaseIdDto } from '@/common/database/dtos/database.id.dto';
import {
  AuthJwtAccessProtected,
  AuthJwtPayload,
} from '@/modules/auth/decorators/auth.jwt.decorator';
import { UserProtected } from '@/modules/user/decorators/user.decorator';
import { PolicyAbilityProtected } from '@/modules/policy/decorators/policy.decorator';
import {
  EnumPolicyAction,
  EnumPolicySubject,
} from '@/modules/policy/enums/policy.enum';
import {
  CARE_RECORD_DEFAULT_AVAILABLE_ORDER_BY,
  CARE_RECORD_DEFAULT_AVAILABLE_SEARCH,
  CARE_RECORD_DEFAULT_PAYMENT_STATUS,
  CARE_RECORD_DEFAULT_STATUS,
} from '../constants/care-record.list.constant';
import { RequestRequiredPipe } from '@/common/request/pipes/request.required.pipe';
import { CareRecordUpdateTechnicianRequestDto } from '../dtos/request/care-record.update-technician.request.dto';
import {
  CareRecordUpdatePaymentStatusRequestDto,
  CareRecordUpdateStatusRequestDto,
} from '../dtos/request/care-record.update-status.request.dto';
import { RoleProtected } from '@/modules/role/decorators/role.decorator';
import { CareRecordUtil } from '../utils/care-record.util';
import {
  RequestGeoLocation,
  RequestIPAddress,
  RequestUserAgent,
} from '@/common/request/decorators/request.decorator';
import {
  GeoLocation,
  UserAgent,
} from '@/modules/user/interfaces/user.interface';

@ApiTags('modules.admin.care-record')
@Controller({
  version: '1',
  path: '/care-record',
})
export class CareRecordAdminController {
  constructor(
    private readonly careRecordService: CareRecordService,
    private readonly careRecordUtil: CareRecordUtil
  ) {}

  @CareRecordAdminListDoc()
  @ResponsePaging('care-record.list')
  @PolicyAbilityProtected({
    subject: EnumPolicySubject.careRecord,
    action: [EnumPolicyAction.read],
  })
  @RoleProtected('admin')
  @UserProtected()
  @AuthJwtAccessProtected()
  @Get('/list')
  async list(
    @PaginationOffsetQuery({
      availableSearch: CARE_RECORD_DEFAULT_AVAILABLE_SEARCH,
      availableOrderBy: CARE_RECORD_DEFAULT_AVAILABLE_ORDER_BY,
    })
    pagination: IPaginationQueryOffsetParams,
    @Query('appointment')
    appointmentId: string,
    @PaginationQueryFilterInEnum('status', CARE_RECORD_DEFAULT_STATUS)
    status: Record<string, IPaginationIn>,
    @PaginationQueryFilterInEnum(
      'paymentStatus',
      CARE_RECORD_DEFAULT_PAYMENT_STATUS
    )
    paymentStatus: Record<string, IPaginationIn>,
    @Query('technician')
    technicianId: string,
    @Query('userVehicle')
    userVehicleId: string
  ): Promise<IResponsePagingReturn<CareRecordListResponseDto>> {
    const filters: Record<string, any> = {
      ...status,
      ...paymentStatus,
    };

    if (appointmentId) {
      filters['appointmentId'] = appointmentId;
    }

    if (technicianId) {
      filters['technicianId'] = technicianId;
    }

    if (userVehicleId) {
      filters['userVehicleId'] = userVehicleId;
    }

    const result = await this.careRecordService.getListOffset(
      pagination,
      filters
    );
    const mapped = this.careRecordUtil.mapList(result.data);
    return {
      ...result,
      data: mapped,
    };
  }

  @CareRecordAdminParamsIdDoc()
  @Response('care-record.get')
  @PolicyAbilityProtected({
    subject: EnumPolicySubject.careRecord,
    action: [EnumPolicyAction.read],
  })
  @RoleProtected('admin')
  @UserProtected()
  @AuthJwtAccessProtected()
  @Get('/get/:id')
  async get(
    @Param('id', RequestRequiredPipe) id: string
  ): Promise<IResponseReturn<CareRecordGetFullResponseDto>> {
    const careRecord = await this.careRecordService.findOneById(id);
    const mapped = this.careRecordUtil.mapGetFull(careRecord);
    return {
      data: mapped,
    };
  }

  @CareRecordAdminCreateDoc()
  @Response('care-record.create')
  @PolicyAbilityProtected({
    subject: EnumPolicySubject.careRecord,
    action: [EnumPolicyAction.create],
  })
  @RoleProtected('admin')
  @UserProtected()
  @AuthJwtAccessProtected()
  @Post('/create')
  async create(
    @AuthJwtPayload('userId') userId: string,
    @RequestIPAddress() ipAddress: string,
    @RequestUserAgent() userAgent: UserAgent,
    @RequestGeoLocation() geoLocation: GeoLocation | null,
    @Body() body: CareRecordCreateRequestDto
  ): Promise<IResponseReturn<DatabaseIdDto>> {
    const data = await this.careRecordService.createWithAppointment(
      body,
      { ipAddress, userAgent, geoLocation },
      userId
    );
    return {
      data: { id: data.id },
      metadataActivityLog: this.careRecordUtil.mapActivityLogMetadata(data),
    };
  }

  @CareRecordAdminUpdateDoc()
  @Response('care-record.update')
  @PolicyAbilityProtected({
    subject: EnumPolicySubject.careRecord,
    action: [EnumPolicyAction.update],
  })
  @RoleProtected('admin')
  @UserProtected()
  @AuthJwtAccessProtected()
  @Put('/update/:id')
  async update(
    @Param('id', RequestRequiredPipe) id: string,
    @AuthJwtPayload('userId') userId: string,
    @RequestIPAddress() ipAddress: string,
    @RequestUserAgent() userAgent: UserAgent,
    @RequestGeoLocation() geoLocation: GeoLocation | null,
    @Body() body: CareRecordUpdateRequestDto
  ): Promise<IResponseReturn<void>> {
    const data = await this.careRecordService.update(
      id,
      body,
      { ipAddress, userAgent, geoLocation },
      userId
    );
    return {
      metadataActivityLog: this.careRecordUtil.mapActivityLogMetadata(data),
    };
  }

  @CareRecordAdminUpdateStatusDoc()
  @Response('care-record.updateStatus')
  @PolicyAbilityProtected({
    subject: EnumPolicySubject.careRecord,
    action: [EnumPolicyAction.update],
  })
  @RoleProtected('admin')
  @UserProtected()
  @AuthJwtAccessProtected()
  @Patch('/update/:id/status')
  async updateStatus(
    @Param('id', RequestRequiredPipe) id: string,
    @AuthJwtPayload('userId') userId: string,
    @RequestIPAddress() ipAddress: string,
    @RequestUserAgent() userAgent: UserAgent,
    @RequestGeoLocation() geoLocation: GeoLocation | null,
    @Body() body: CareRecordUpdateStatusRequestDto
  ): Promise<IResponseReturn<void>> {
    const data = await this.careRecordService.updateStatus(
      id,
      body,
      { ipAddress, userAgent, geoLocation },
      userId
    );
    return {
      metadataActivityLog: this.careRecordUtil.mapActivityLogMetadata(data),
    };
  }

  @CareRecordAdminUpdatePaymentStatusDoc()
  @Response('care-record.updatePaymentStatus')
  @PolicyAbilityProtected({
    subject: EnumPolicySubject.careRecord,
    action: [EnumPolicyAction.update],
  })
  @RoleProtected('admin')
  @UserProtected()
  @AuthJwtAccessProtected()
  @Patch('/update/:id/paymentStatus')
  async updatePaymentStatus(
    @Param('id', RequestRequiredPipe) id: string,
    @AuthJwtPayload('userId') userId: string,
    @RequestIPAddress() ipAddress: string,
    @RequestUserAgent() userAgent: UserAgent,
    @RequestGeoLocation() geoLocation: GeoLocation | null,
    @Body() body: CareRecordUpdatePaymentStatusRequestDto
  ): Promise<IResponseReturn<void>> {
    const data = await this.careRecordService.updatePaymentStatus(
      id,
      body,
      { ipAddress, userAgent, geoLocation },
      userId
    );
    return {
      metadataActivityLog: this.careRecordUtil.mapActivityLogMetadata(data),
    };
  }

  @CareRecordAdminUpdateTechnicianDoc()
  @Response('care-record.updateTechnician')
  @PolicyAbilityProtected({
    subject: EnumPolicySubject.careRecord,
    action: [EnumPolicyAction.update],
  })
  @RoleProtected('admin')
  @UserProtected()
  @AuthJwtAccessProtected()
  @Patch('/update/:id/technician')
  async updateTechnician(
    @Param('id', RequestRequiredPipe) id: string,
    @AuthJwtPayload('userId') userId: string,
    @RequestIPAddress() ipAddress: string,
    @RequestUserAgent() userAgent: UserAgent,
    @RequestGeoLocation() geoLocation: GeoLocation | null,
    @Body() body: CareRecordUpdateTechnicianRequestDto
  ): Promise<IResponseReturn<void>> {
    const data = await this.careRecordService.updateTechnician(
      id,
      body,
      { ipAddress, userAgent, geoLocation },
      userId
    );
    return {
      metadataActivityLog: this.careRecordUtil.mapActivityLogMetadata(data),
    };
  }

  @CareRecordAdminDeleteDoc()
  @Response('care-record.delete')
  @PolicyAbilityProtected({
    subject: EnumPolicySubject.careRecord,
    action: [EnumPolicyAction.delete],
  })
  @RoleProtected('admin')
  @UserProtected()
  @AuthJwtAccessProtected()
  @Delete('/delete/:id')
  async delete(
    @Param('id', RequestRequiredPipe) id: string,
    @AuthJwtPayload('userId') userId: string,
    @RequestIPAddress() ipAddress: string,
    @RequestUserAgent() userAgent: UserAgent,
    @RequestGeoLocation() geoLocation: GeoLocation | null
  ): Promise<IResponseReturn<void>> {
    const data = await this.careRecordService.delete(
      id,
      { ipAddress, userAgent, geoLocation },
      userId
    );
    return {
      metadataActivityLog: this.careRecordUtil.mapActivityLogMetadata(data),
    };
  }

  @CareRecordAdminCreateChecklistDoc()
  @Response('care-record.createChecklist')
  @PolicyAbilityProtected({
    subject: EnumPolicySubject.careRecord,
    action: [EnumPolicyAction.create],
  })
  @RoleProtected('admin')
  @UserProtected()
  @AuthJwtAccessProtected()
  @Post('/create/:id/checklist')
  async createChecklist(
    @AuthJwtPayload('userId') userId: string,
    @RequestIPAddress() ipAddress: string,
    @RequestUserAgent() userAgent: UserAgent,
    @RequestGeoLocation() geoLocation: GeoLocation | null,
    @Body() body: CareRecordCreateRequestDto
  ): Promise<IResponseReturn<DatabaseIdDto>> {
    const data = await this.careRecordService.createWithAppointment(
      body,
      { ipAddress, userAgent, geoLocation },
      userId
    );
    return {
      data: { id: data.id },
      metadataActivityLog: this.careRecordUtil.mapActivityLogMetadata(data),
    };
  }

  // === Trash/Restore ===

  @CareRecordAdminTrashListDoc()
  @ResponsePaging('care-record.trashList')
  @PolicyAbilityProtected({
    subject: EnumPolicySubject.careRecord,
    action: [EnumPolicyAction.read],
  })
  @RoleProtected('admin')
  @UserProtected()
  @AuthJwtAccessProtected()
  @Get('/trash')
  async trashList(
    @PaginationOffsetQuery({
      availableSearch: CARE_RECORD_DEFAULT_AVAILABLE_SEARCH,
      availableOrderBy: CARE_RECORD_DEFAULT_AVAILABLE_ORDER_BY,
    })
    pagination: IPaginationQueryOffsetParams
  ): Promise<IResponsePagingReturn<CareRecordListResponseDto>> {
    const result = await this.careRecordService.getTrashList(pagination);
    const mapped = this.careRecordUtil.mapList(result.data);
    return {
      ...result,
      data: mapped,
    };
  }

  @CareRecordAdminRestoreDoc()
  @Response('care-record.restore')
  @PolicyAbilityProtected({
    subject: EnumPolicySubject.careRecord,
    action: [EnumPolicyAction.update],
  })
  @RoleProtected('admin')
  @UserProtected()
  @AuthJwtAccessProtected()
  @Post('/restore/:id')
  async restore(
    @Param('id', RequestRequiredPipe) id: string,
    @AuthJwtPayload('userId') restoredBy: string,
    @RequestIPAddress() ipAddress: string,
    @RequestUserAgent() userAgent: UserAgent,
    @RequestGeoLocation() geoLocation: GeoLocation | null
  ): Promise<IResponseReturn<void>> {
    const data = await this.careRecordService.restore(
      id,
      { ipAddress, userAgent, geoLocation },
      restoredBy
    );
    return {
      metadataActivityLog: this.careRecordUtil.mapActivityLogMetadata(data),
    };
  }

  @CareRecordAdminForceDeleteDoc()
  @Response('care-record.forceDelete')
  @PolicyAbilityProtected({
    subject: EnumPolicySubject.careRecord,
    action: [EnumPolicyAction.delete],
  })
  @RoleProtected('admin')
  @UserProtected()
  @AuthJwtAccessProtected()
  @Delete('/force-delete/:id')
  async forceDelete(
    @Param('id', RequestRequiredPipe) id: string,
    @AuthJwtPayload('userId') deletedBy: string,
    @RequestIPAddress() ipAddress: string,
    @RequestUserAgent() userAgent: UserAgent,
    @RequestGeoLocation() geoLocation: GeoLocation | null
  ): Promise<IResponseReturn<void>> {
    const data = await this.careRecordService.forceDelete(
      id,
      { ipAddress, userAgent, geoLocation },
      deletedBy
    );
    return {
      metadataActivityLog: this.careRecordUtil.mapActivityLogMetadata(data),
    };
  }
}
