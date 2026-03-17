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
import { CareRecordServiceService } from '../services/care-record-service.service';
import { CareRecordServiceCreateRequestDto } from '../dtos/request/care-record-service.create.request.dto';
import { CareRecordServiceUpdateRequestDto } from '../dtos/request/care-record-service.update.request.dto';
import {
  Response,
  ResponsePaging,
} from '@/common/response/decorators/response.decorator';
import {
  IResponseReturn,
  IResponsePagingReturn,
} from '@/common/response/interfaces/response.interface';
import { CareRecordServiceListResponseDto } from '../dtos/response/care-record-service.list.response.dto';
import { CareRecordServiceGetFullResponseDto } from '../dtos/response/care-record-service.full.response.dto';
import {
  PaginationOffsetQuery,
  PaginationQueryFilterInEnum,
} from '@/common/pagination/decorators/pagination.decorator';
import {
  IPaginationQueryOffsetParams,
  IPaginationIn,
} from '@/common/pagination/interfaces/pagination.interface';
import {
  CareRecordServiceAdminCreateDoc,
  CareRecordServiceAdminDeleteDoc,
  CareRecordServiceAdminListDoc,
  CareRecordServiceAdminListWithChecklistsDoc,
  CareRecordServiceAdminParamsIdDoc,
  CareRecordServiceAdminUpdateDoc,
  CareRecordServiceAdminUpdateStatusDoc,
} from '../docs/care-record-service.admin.doc';
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
  CARE_RECORD_SERVICE_DEFAULT_AVAILABLE_ORDER_BY,
  CARE_RECORD_SERVICE_DEFAULT_AVAILABLE_SEARCH,
  CARE_RECORD_SERVICE_DEFAULT_STATUS,
} from '../constants/care-record-service.list.constant';
import { RequestRequiredPipe } from '@/common/request/pipes/request.required.pipe';
import { RequestIsValidUuidPipe } from '@/common/request/pipes/request.is-valid-uuid.pipe';
import { RequestOptionalParseUUIDPipe } from '@/common/request/pipes/request.optional-parse-uuid.pipe';
import { CareRecordServiceUpdateStatusRequestDto } from '../dtos/request/care-record-service.update-status.request.dto';
import { CareRecordServiceWithChecklistsResponseDto } from '../dtos/response/care-record-service.with-checklists.response.dto';
import { RoleProtected } from '@/modules/role/decorators/role.decorator';
import { CareRecordServiceUtil } from '../utils/care-record-service.util';
import { PaginationUtil } from '@/common/pagination/utils/pagination.util';
import {
  IDatabaseCreateOptions,
  IDatabaseSaveOptions,
} from '@/common/database/interfaces/database.interface';

@ApiTags('modules.admin.care-record-service')
@Controller({
  version: '1',
  path: '/care-record-service',
})
export class CareRecordServiceAdminController {
  constructor(
    private readonly careRecordServiceService: CareRecordServiceService,
    private readonly careRecordServiceUtil: CareRecordServiceUtil,
    private readonly paginationUtil: PaginationUtil,
  ) {}

  @CareRecordServiceAdminListDoc()
  @ResponsePaging('care-record-service.list')
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
      availableSearch: CARE_RECORD_SERVICE_DEFAULT_AVAILABLE_SEARCH,
      availableOrderBy: CARE_RECORD_SERVICE_DEFAULT_AVAILABLE_ORDER_BY,
    })
    pagination: IPaginationQueryOffsetParams,
    @PaginationQueryFilterInEnum('status', CARE_RECORD_SERVICE_DEFAULT_STATUS)
    status: Record<string, IPaginationIn>,
    @Query('careRecord', RequestOptionalParseUUIDPipe)
    careRecordId: string,
  ): Promise<IResponsePagingReturn<CareRecordServiceListResponseDto>> {
    const filters: Record<string, any> = {
      ...status,
    };

    if (careRecordId) {
      filters['careRecord'] = careRecordId;
    }

    const { data, total } = await this.careRecordServiceService.getListOffset(
      pagination,
      filters,
    );
    const mapped = this.careRecordServiceUtil.mapList(data);
    return this.paginationUtil.formatOffset(mapped, total, pagination);
  }

  @CareRecordServiceAdminListWithChecklistsDoc()
  @ResponsePaging('care-record-service.listWithChecklists')
  @RoleProtected(EnumRoleType.admin)
  @UserProtected()
  @AuthJwtAccessProtected()
  @Get('/list/checklists')
  async listWithChecklists(
    @PaginationOffsetQuery({
      availableSearch: CARE_RECORD_SERVICE_DEFAULT_AVAILABLE_SEARCH,
      availableOrderBy: CARE_RECORD_SERVICE_DEFAULT_AVAILABLE_ORDER_BY,
    })
    pagination: IPaginationQueryOffsetParams,
    @PaginationQueryFilterInEnum('status', CARE_RECORD_SERVICE_DEFAULT_STATUS)
    status: Record<string, IPaginationIn>,
    @Query('careRecord', RequestOptionalParseUUIDPipe)
    careRecordId: string,
  ): Promise<
    IResponsePagingReturn<CareRecordServiceWithChecklistsResponseDto>
  > {
    const filters: Record<string, any> = {
      ...status,
    };

    if (careRecordId) {
      filters['careRecord'] = careRecordId;
    }

    const { data, total } =
      await this.careRecordServiceService.getListOffsetWithChecklists(
        pagination,
        filters,
      );

    const mapped = data.map((item) => {
      const serviceData =
        typeof (item.service as any).toObject === 'function'
          ? (item.service as any).toObject()
          : item.service;
      return this.careRecordServiceUtil.mapWithChecklists(
        serviceData,
        item.checklists,
      );
    });

    return this.paginationUtil.formatOffset(mapped, total, pagination);
  }

  @CareRecordServiceAdminParamsIdDoc()
  @Response('care-record-service.get')
  @RoleProtected(EnumRoleType.admin)
  @UserProtected()
  @AuthJwtAccessProtected()
  @Get('/get/:id')
  async get(
    @Param('id', RequestRequiredPipe, RequestIsValidUuidPipe) id: string,
  ): Promise<IResponseReturn<CareRecordServiceGetFullResponseDto>> {
    const careRecordService =
      await this.careRecordServiceService.findOneById(id);
    const mapped = this.careRecordServiceUtil.mapGetFull(careRecordService);
    return {
      data: mapped,
    };
  }

  @CareRecordServiceAdminCreateDoc()
  @Response('care-record-service.create')
  @RoleProtected(EnumRoleType.admin)
  @UserProtected()
  @AuthJwtAccessProtected()
  @Post('/create')
  async create(
    @AuthJwtPayload('user') createdBy: string,
    @Body() body: CareRecordServiceCreateRequestDto,
  ): Promise<IResponseReturn<DatabaseIdDto>> {
    const created = await this.careRecordServiceService.create(body, {
      actionBy: createdBy,
    } as IDatabaseCreateOptions);
    return {
      data: {
        _id: created._id,
      },
    };
  }

  @CareRecordServiceAdminUpdateDoc()
  @Response('care-record-service.update')
  @RoleProtected(EnumRoleType.admin)
  @UserProtected()
  @AuthJwtAccessProtected()
  @Put('/update/:id')
  async update(
    @Param('id', RequestRequiredPipe, RequestIsValidUuidPipe) id: string,
    @AuthJwtPayload('user') updatedBy: string,
    @Body() body: CareRecordServiceUpdateRequestDto,
  ): Promise<IResponseReturn<void>> {
    await this.careRecordServiceService.update(id, body, {
      actionBy: updatedBy,
    } as IDatabaseSaveOptions);
    return {};
  }

  @CareRecordServiceAdminUpdateStatusDoc()
  @Response('care-record-service.updateStatus')
  @RoleProtected(EnumRoleType.admin)
  @UserProtected()
  @AuthJwtAccessProtected()
  @Patch('/update/:id/status')
  async updateStatus(
    @Param('id', RequestRequiredPipe, RequestIsValidUuidPipe) id: string,
    @AuthJwtPayload('user') updatedBy: string,
    @Body() body: CareRecordServiceUpdateStatusRequestDto,
  ): Promise<IResponseReturn<void>> {
    await this.careRecordServiceService.updateStatus(id, body, {
      actionBy: updatedBy,
    } as IDatabaseSaveOptions);
    return {};
  }

  @CareRecordServiceAdminDeleteDoc()
  @Response('care-record-service.delete')
  @RoleProtected(EnumRoleType.admin)
  @UserProtected()
  @AuthJwtAccessProtected()
  @Delete('/delete/:id')
  async delete(
    @Param('id', RequestRequiredPipe, RequestIsValidUuidPipe) id: string,
    @AuthJwtPayload('user') actionBy: string,
  ): Promise<IResponseReturn<void>> {
    await this.careRecordServiceService.delete(id, {
      actionBy,
    } as IDatabaseSaveOptions);
    return {};
  }
}
