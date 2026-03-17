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
import { CareRecordChecklistService } from '../services/care-record-checklist.service';
import { CareRecordChecklistCreateRequestDto } from '../dtos/request/care-record-checklist.create.request.dto';
import { CareRecordChecklistUpdateRequestDto } from '../dtos/request/care-record-checklist.update.request.dto';
import {
  Response,
  ResponsePaging,
} from '@/common/response/decorators/response.decorator';
import {
  IResponseReturn,
  IResponsePagingReturn,
} from '@/common/response/interfaces/response.interface';
import { CareRecordChecklistListResponseDto } from '../dtos/response/care-record-checklist.list.response.dto';
import { CareRecordChecklistDto } from '../dtos/care-record-checklist.dto';
import {
  IDatabaseCreateOptions,
  IDatabaseSaveOptions,
} from '@/common/database/interfaces/database.interface';
import {
  PaginationOffsetQuery,
  PaginationQueryFilterInEnum,
} from '@/common/pagination/decorators/pagination.decorator';
import {
  IPaginationQueryOffsetParams,
  IPaginationIn,
} from '@/common/pagination/interfaces/pagination.interface';
import {
  CareRecordChecklistCreateDoc,
  CareRecordChecklistDeleteDoc,
  CareRecordChecklistListDoc,
  CareRecordChecklistParamsIdDoc,
  CareRecordChecklistUpdateDoc,
  CareRecordChecklistUpdateStatusDoc,
  CareRecordChecklistUpdateResultDoc,
} from '../docs/care-record-checklist.doc';
import { DatabaseIdDto } from '@/common/database/dtos/database.id.response.dto';
import {
  AuthJwtAccessProtected,
  AuthJwtPayload,
} from '@/modules/auth/decorators/auth.jwt.decorator';
import { UserProtected } from '@/modules/user/decorators/user.decorator';
import { EnumRoleType } from '@/modules/policy/enums/policy.enum';
import {
  CARE_RECORD_CHECKLIST_DEFAULT_AVAILABLE_ORDER_BY,
  CARE_RECORD_CHECKLIST_DEFAULT_AVAILABLE_SEARCH,
  CARE_RECORD_CHECKLIST_DEFAULT_RESULT,
  CARE_RECORD_CHECKLIST_DEFAULT_STATUS,
} from '../constants/care-record-checklist.list.constant';
import { RequestRequiredPipe } from '@/common/request/pipes/request.required.pipe';
import { RequestIsValidUuidPipe } from '@/common/request/pipes/request.is-valid-uuid.pipe';
import { OptionalParseUUIDPipe } from '@/app/pipes/optional-parse-uuid.pipe';
import { CareRecordChecklistUpdateStatusRequestDto } from '../dtos/request/care-record-checklist.update-status.request.dto';
import { CareRecordChecklistUpdateResultRequestDto } from '../dtos/request/care-record-checklist.update-result.request.dto';
import { RoleProtected } from '@/modules/role/decorators/role.decorator';
import { CareRecordChecklistGetFullResponseDto } from '../dtos/response/care-record-checklist.full.response.dto';

@ApiTags('modules.care-record-checklist')
@Controller({
  version: '1',
  path: '/care-record-checklist',
})
export class CareRecordChecklistController {
  constructor(
    private readonly careRecordChecklistService: CareRecordChecklistService,
  ) {}

  @CareRecordChecklistListDoc()
  @ResponsePaging('care-record-checklist.list')
  @RoleProtected(
    EnumRoleType.admin,
    EnumRoleType.manager,
    EnumRoleType.technician,
  )
  @UserProtected()
  @AuthJwtAccessProtected()
  @Get('/list')
  async list(
    @PaginationOffsetQuery({
      availableSearch: CARE_RECORD_CHECKLIST_DEFAULT_AVAILABLE_SEARCH,
      availableOrderBy: CARE_RECORD_CHECKLIST_DEFAULT_AVAILABLE_ORDER_BY,
    })
    pagination: IPaginationQueryOffsetParams,
    @PaginationQueryFilterInEnum('status', CARE_RECORD_CHECKLIST_DEFAULT_STATUS)
    status: Record<string, IPaginationIn>,
    @PaginationQueryFilterInEnum('result', CARE_RECORD_CHECKLIST_DEFAULT_RESULT)
    result: Record<string, IPaginationIn>,
    @Query('careRecordService', OptionalParseUUIDPipe)
    careRecordServiceId: string,
  ): Promise<IResponsePagingReturn<CareRecordChecklistListResponseDto>> {
    const filters: Record<string, any> = {
      ...status,
      ...result,
    };

    if (careRecordServiceId) {
      filters['careRecordService._id'] = careRecordServiceId;
    }

    return this.careRecordChecklistService.getListOffset(pagination, filters);
  }

  @CareRecordChecklistParamsIdDoc()
  @Response('care-record-checklist.get')
  @RoleProtected(
    EnumRoleType.admin,
    EnumRoleType.manager,
    EnumRoleType.technician,
  )
  @UserProtected()
  @AuthJwtAccessProtected()
  @Get('/get/:id')
  async get(
    @Param('id', RequestRequiredPipe, RequestIsValidUuidPipe) id: string,
  ): Promise<IResponseReturn<CareRecordChecklistGetFullResponseDto>> {
    return this.careRecordChecklistService.findOneById(id);
  }

  @CareRecordChecklistCreateDoc()
  @Response('care-record-checklist.create')
  @RoleProtected(
    EnumRoleType.admin,
    EnumRoleType.manager,
    EnumRoleType.technician,
  )
  @UserProtected()
  @AuthJwtAccessProtected()
  @Post('/create')
  async create(
    @AuthJwtPayload('user') createdBy: string,
    @Body() body: CareRecordChecklistCreateRequestDto,
  ): Promise<IResponseReturn<DatabaseIdDto>> {
    return this.careRecordChecklistService.create(body, {
      actionBy: createdBy,
    } as IDatabaseCreateOptions);
  }

  @CareRecordChecklistUpdateDoc()
  @Response('care-record-checklist.update')
  @RoleProtected(
    EnumRoleType.admin,
    EnumRoleType.manager,
    EnumRoleType.technician,
  )
  @UserProtected()
  @AuthJwtAccessProtected()
  @Put('/update/:id')
  async update(
    @Param('id', RequestRequiredPipe, RequestIsValidUuidPipe) id: string,
    @AuthJwtPayload('user') updatedBy: string,
    @Body() body: CareRecordChecklistUpdateRequestDto,
  ): Promise<IResponseReturn<void>> {
    return this.careRecordChecklistService.update(id, body, {
      actionBy: updatedBy,
    } as IDatabaseSaveOptions);
  }

  @CareRecordChecklistUpdateStatusDoc()
  @Response('care-record-checklist.updateStatus')
  @RoleProtected(
    EnumRoleType.admin,
    EnumRoleType.manager,
    EnumRoleType.technician,
  )
  @UserProtected()
  @AuthJwtAccessProtected()
  @Patch('/update/:id/status')
  async updateStatus(
    @Param('id', RequestRequiredPipe, RequestIsValidUuidPipe) id: string,
    @AuthJwtPayload('user') updatedBy: string,
    @Body() body: CareRecordChecklistUpdateStatusRequestDto,
  ): Promise<IResponseReturn<void>> {
    return this.careRecordChecklistService.updateStatus(id, body, {
      actionBy: updatedBy,
    } as IDatabaseSaveOptions);
  }

  @CareRecordChecklistUpdateResultDoc()
  @Response('care-record-checklist.updateResult')
  @RoleProtected(
    EnumRoleType.admin,
    EnumRoleType.manager,
    EnumRoleType.technician,
  )
  @UserProtected()
  @AuthJwtAccessProtected()
  @Patch('/update/:id/result')
  async updateResult(
    @Param('id', RequestRequiredPipe, RequestIsValidUuidPipe) id: string,
    @AuthJwtPayload('user') updatedBy: string,
    @Body() body: CareRecordChecklistUpdateResultRequestDto,
  ): Promise<IResponseReturn<void>> {
    return this.careRecordChecklistService.updateResult(id, body, {
      actionBy: updatedBy,
    } as IDatabaseSaveOptions);
  }

  @CareRecordChecklistDeleteDoc()
  @Response('care-record-checklist.delete')
  @RoleProtected(
    EnumRoleType.admin,
    EnumRoleType.manager,
    EnumRoleType.technician,
  )
  @UserProtected()
  @AuthJwtAccessProtected()
  @Delete('/delete/:id')
  async delete(
    @Param('id', RequestRequiredPipe, RequestIsValidUuidPipe) id: string,
    @AuthJwtPayload('user') actionBy: string,
  ): Promise<IResponseReturn<void>> {
    return this.careRecordChecklistService.delete(id, {
      actionBy,
    } as IDatabaseSaveOptions);
  }
}
