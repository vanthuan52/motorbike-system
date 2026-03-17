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
} from '../docs/care-record.admin.doc';
import { DatabaseIdDto } from '@/common/database/dtos/database.id.response.dto';
import {
  AuthJwtAccessProtected,
  AuthJwtPayload,
} from '@/modules/auth/decorators/auth.jwt.decorator';
import { UserProtected } from '@/modules/user/decorators/user.decorator';
import { PolicyAbilityProtected } from '@/modules/policy/decorators/policy.decorator';
import {
  EnumPolicyAction,
  EnumRoleType,
  EnumPolicySubject,
} from '@/modules/policy/enums/policy.enum';
import {
  CARE_RECORD_DEFAULT_AVAILABLE_ORDER_BY,
  CARE_RECORD_DEFAULT_AVAILABLE_SEARCH,
  CARE_RECORD_DEFAULT_PAYMENT_STATUS,
  CARE_RECORD_DEFAULT_STATUS,
} from '../constants/care-record.list.constant';
import { RequestRequiredPipe } from '@/common/request/pipes/request.required.pipe';
import { RequestIsValidUuidPipe } from '@/common/request/pipes/request.is-valid-uuid.pipe';
import { RequestOptionalParseUUIDPipe } from '@/common/request/pipes/request.optional-parse-uuid.pipe';
import { CareRecordUpdateTechnicianRequestDto } from '../dtos/request/care-record.update-technician.request.dto';
import {
  CareRecordUpdatePaymentStatusRequestDto,
  CareRecordUpdateStatusRequestDto,
} from '../dtos/request/care-record.update-status.request.dto';
import { RoleProtected } from '@/modules/role/decorators/role.decorator';
import { CareRecordUtil } from '../utils/care-record.util';
import { PaginationUtil } from '@/common/pagination/utils/pagination.util';
import {
  IDatabaseCreateOptions,
  IDatabaseSaveOptions,
} from '@/common/database/interfaces/database.interface';

@ApiTags('modules.admin.care-record')
@Controller({
  version: '1',
  path: '/care-record',
})
export class CareRecordAdminController {
  constructor(
    private readonly careRecordService: CareRecordService,
    private readonly careRecordUtil: CareRecordUtil,
    private readonly paginationUtil: PaginationUtil,
  ) {}

  @CareRecordAdminListDoc()
  @ResponsePaging('care-record.list')
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
      availableSearch: CARE_RECORD_DEFAULT_AVAILABLE_SEARCH,
      availableOrderBy: CARE_RECORD_DEFAULT_AVAILABLE_ORDER_BY,
    })
    pagination: IPaginationQueryOffsetParams,
    @Query('appointment', RequestOptionalParseUUIDPipe)
    appointmentId: string,
    @PaginationQueryFilterInEnum('status', CARE_RECORD_DEFAULT_STATUS)
    status: Record<string, IPaginationIn>,
    @PaginationQueryFilterInEnum(
      'paymentStatus',
      CARE_RECORD_DEFAULT_PAYMENT_STATUS,
    )
    paymentStatus: Record<string, IPaginationIn>,
    @Query('technician', RequestOptionalParseUUIDPipe)
    technicianId: string,
    @Query('userVehicle', RequestOptionalParseUUIDPipe)
    userVehicleId: string,
  ): Promise<IResponsePagingReturn<CareRecordListResponseDto>> {
    const filters: Record<string, any> = {
      ...status,
      ...paymentStatus,
    };

    if (appointmentId) {
      filters['appointment._id'] = appointmentId;
    }

    if (technicianId) {
      filters['technician._id'] = technicianId;
    }

    if (userVehicleId) {
      filters['userVehicle._id'] = userVehicleId;
    }

    const { data, total } = await this.careRecordService.getListOffset(
      pagination,
      filters,
    );
    const mapped = this.careRecordUtil.mapList(data);
    return this.paginationUtil.formatOffset(mapped, total, pagination);
  }

  @CareRecordAdminParamsIdDoc()
  @Response('care-record.get')
  @PolicyAbilityProtected({
    subject: EnumPolicySubject.user,
    action: [EnumPolicyAction.read],
  })
  @RoleProtected(EnumRoleType.admin)
  @UserProtected()
  @AuthJwtAccessProtected()
  @Get('/get/:id')
  async get(
    @Param('id', RequestRequiredPipe, RequestIsValidUuidPipe) id: string,
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
    subject: EnumPolicySubject.user,
    action: [EnumPolicyAction.create],
  })
  @RoleProtected(EnumRoleType.admin)
  @UserProtected()
  @AuthJwtAccessProtected()
  @Post('/create')
  async create(
    @AuthJwtPayload('user') createdBy: string,
    @Body() body: CareRecordCreateRequestDto,
  ): Promise<IResponseReturn<DatabaseIdDto>> {
    const created = await this.careRecordService.createWithAppointment(body, {
      actionBy: createdBy,
    } as IDatabaseCreateOptions);
    return {
      data: {
        _id: created._id,
      },
    };
  }

  @CareRecordAdminUpdateDoc()
  @Response('care-record.update')
  @PolicyAbilityProtected({
    subject: EnumPolicySubject.user,
    action: [EnumPolicyAction.update],
  })
  @RoleProtected(EnumRoleType.admin)
  @UserProtected()
  @AuthJwtAccessProtected()
  @Put('/update/:id')
  async update(
    @Param('id', RequestRequiredPipe, RequestIsValidUuidPipe) id: string,
    @AuthJwtPayload('user') updatedBy: string,
    @Body() body: CareRecordUpdateRequestDto,
  ): Promise<IResponseReturn<void>> {
    await this.careRecordService.update(id, body, {
      actionBy: updatedBy,
    } as IDatabaseSaveOptions);
    return {};
  }

  @CareRecordAdminUpdateStatusDoc()
  @Response('care-record.updateStatus')
  @PolicyAbilityProtected({
    subject: EnumPolicySubject.user,
    action: [EnumPolicyAction.update],
  })
  @RoleProtected(EnumRoleType.admin)
  @UserProtected()
  @AuthJwtAccessProtected()
  @Patch('/update/:id/status')
  async updateStatus(
    @Param('id', RequestRequiredPipe, RequestIsValidUuidPipe) id: string,
    @AuthJwtPayload('user') updatedBy: string,
    @Body() body: CareRecordUpdateStatusRequestDto,
  ): Promise<IResponseReturn<void>> {
    await this.careRecordService.updateStatus(id, body, {
      actionBy: updatedBy,
    } as IDatabaseSaveOptions);
    return {};
  }

  @CareRecordAdminUpdatePaymentStatusDoc()
  @Response('care-record.updatePaymentStatus')
  @PolicyAbilityProtected({
    subject: EnumPolicySubject.user,
    action: [EnumPolicyAction.update],
  })
  @RoleProtected(EnumRoleType.admin)
  @UserProtected()
  @AuthJwtAccessProtected()
  @Patch('/update/:id/paymentStatus')
  async updatePaymentStatus(
    @Param('id', RequestRequiredPipe, RequestIsValidUuidPipe) id: string,
    @AuthJwtPayload('user') updatedBy: string,
    @Body() body: CareRecordUpdatePaymentStatusRequestDto,
  ): Promise<IResponseReturn<void>> {
    await this.careRecordService.updatePaymentStatus(id, body, {
      actionBy: updatedBy,
    } as IDatabaseSaveOptions);
    return {};
  }

  @CareRecordAdminUpdateTechnicianDoc()
  @Response('care-record.updateTechnician')
  @PolicyAbilityProtected({
    subject: EnumPolicySubject.user,
    action: [EnumPolicyAction.update],
  })
  @RoleProtected(EnumRoleType.admin)
  @UserProtected()
  @AuthJwtAccessProtected()
  @Patch('/update/:id/technician')
  async updateTechnician(
    @Param('id', RequestRequiredPipe, RequestIsValidUuidPipe) id: string,
    @AuthJwtPayload('user') updatedBy: string,
    @Body() body: CareRecordUpdateTechnicianRequestDto,
  ): Promise<IResponseReturn<void>> {
    await this.careRecordService.updateTechnician(id, body, {
      actionBy: updatedBy,
    } as IDatabaseSaveOptions);
    return {};
  }

  @CareRecordAdminDeleteDoc()
  @Response('care-record.delete')
  @PolicyAbilityProtected({
    subject: EnumPolicySubject.user,
    action: [EnumPolicyAction.delete],
  })
  @RoleProtected(EnumRoleType.admin)
  @UserProtected()
  @AuthJwtAccessProtected()
  @Delete('/delete/:id')
  async delete(
    @Param('id', RequestRequiredPipe, RequestIsValidUuidPipe) id: string,
    @AuthJwtPayload('user') actionBy: string,
  ): Promise<IResponseReturn<void>> {
    await this.careRecordService.softDelete(id, {
      actionBy,
    } as IDatabaseSaveOptions);
    return {};
  }

  @CareRecordAdminCreateChecklistDoc()
  @Response('care-record.createChecklist')
  @PolicyAbilityProtected({
    subject: EnumPolicySubject.user,
    action: [EnumPolicyAction.create],
  })
  @RoleProtected(EnumRoleType.admin)
  @UserProtected()
  @AuthJwtAccessProtected()
  @Post('/create/:id/checklist')
  async createChecklist(
    @AuthJwtPayload('user') createdBy: string,
    @Body() body: CareRecordCreateRequestDto,
  ): Promise<IResponseReturn<DatabaseIdDto>> {
    const created = await this.careRecordService.createWithAppointment(body, {
      actionBy: createdBy,
    } as IDatabaseCreateOptions);
    return {
      data: {
        _id: created._id,
      },
    };
  }
}
