import {
  Body,
  Controller,
  Get,
  Post,
  Put,
  Patch,
  Delete,
  Param,
  NotFoundException,
  InternalServerErrorException,
  Query,
  Logger,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CareRecordChecklistService } from '../services/care-record-checklist.service';
import { CareRecordChecklistCreateRequestDto } from '../dtos/request/care-record-checklist.create.request.dto';
import { CareRecordChecklistUpdateRequestDto } from '../dtos/request/care-record-checklist.update.request.dto';
import { PaginationListDto } from '@/common/pagination/dtos/pagination.list.dto';
import {
  Response,
  ResponsePaging,
} from '@/common/response/decorators/response.decorator';
import {
  IResponse,
  IResponsePaging,
} from '@/common/response/interfaces/response.interface';
import { CareRecordChecklistListResponseDto } from '../dtos/response/care-record-checklist.list.response.dto';
import { CareRecordChecklistGetResponseDto } from '../dtos/response/care-record-checklist.get.response.dto';
import {
  IDatabaseCreateOptions,
  IDatabaseDeleteOptions,
  IDatabaseSaveOptions,
} from '@/common/database/interfaces/database.interface';
import {
  PaginationQuery,
  PaginationQueryFilterInEnum,
} from '@/common/pagination/decorators/pagination.decorator';
import { PaginationService } from '@/common/pagination/services/pagination.service';
import {
  CareRecordChecklistAdminCreateDoc,
  CareRecordChecklistAdminDeleteDoc,
  CareRecordChecklistAdminListDoc,
  CareRecordChecklistAdminParamsIdDoc,
  CareRecordChecklistAdminUpdateDoc,
  CareRecordChecklistAdminUpdateStatusDoc,
  CareRecordChecklistAdminUpdateWearPercentageDoc,
  CareRecordChecklistAdminUpdateNoteDoc,
} from '../docs/care-record-checklist.admin.doc';
import { DatabaseIdResponseDto } from '@/common/database/dtos/response/database.id.response.dto';
import { ENUM_CARE_RECORD_CHECKLIST_STATUS_CODE_ERROR } from '../enums/care-record-checklist.status-code.enum';
import { ENUM_APP_STATUS_CODE_ERROR } from '@/app/enums/app.status-code.num';
import {
  AuthJwtAccessProtected,
  AuthJwtPayload,
} from '@/modules/auth/decorators/auth.jwt.decorator';
import { UserProtected } from '@/modules/user/decorators/user.decorator';
import {
  PolicyAbilityProtected,
  PolicyRoleProtected,
} from '@/modules/policy/decorators/policy.decorator';
import {
  ENUM_POLICY_ACTION,
  ENUM_POLICY_ROLE_TYPE,
  ENUM_POLICY_SUBJECT,
} from '@/modules/policy/enums/policy.enum';
import {
  CARE_RECORD_CHECKLIST_DEFAULT_AVAILABLE_ORDER_BY,
  CARE_RECORD_CHECKLIST_DEFAULT_AVAILABLE_SEARCH,
  CARE_RECORD_CHECKLIST_DEFAULT_STATUS,
} from '../constants/care-record-checklist.list.constant';
import { RequestRequiredPipe } from '@/common/request/pipes/request.required.pipe';
import { CareRecordChecklistParsePipe } from '../pipes/care-record-checklist.parse.pipe';
import { CareRecordChecklistDoc } from '../entities/care-record-checklist.entity';
import { ICareRecordChecklistDoc } from '../interfaces/care-record-checklist.interface';
import { OptionalParseUUIDPipe } from '@/app/pipes/optional-parse-uuid.pipe';
import { ENUM_CARE_RECORD_CHECKLIST_STATUS } from '../enums/care-record-checklist.enum';
import { CareRecordChecklistUpdateStatusRequestDto } from '../dtos/request/care-record-checklist.update-status.request.dto';
import { CareRecordService } from '@/modules/care-record/services/care-record.service';
import { ServiceChecklistService } from '@/modules/service-checklist/services/service-checklist.service';
import { ENUM_CARE_RECORD_STATUS_CODE_ERROR } from '@/modules/care-record/enums/care-record.status-code.enum';
import { ENUM_SERVICE_CHECKLIST_STATUS_CODE_ERROR } from '@/modules/service-checklist/enums/service-checklist.status-code.enum';

@ApiTags('modules.admin.care-record-checklist')
@Controller({
  version: '1',
  path: '/care-record-checklist',
})
export class CareRecordChecklistAdminController {
  private readonly logger = new Logger(CareRecordChecklistAdminController.name);
  constructor(
    private readonly careRecordService: CareRecordService,
    private readonly serviceChecklistService: ServiceChecklistService,
    private readonly careRecordChecklistService: CareRecordChecklistService,
    private readonly paginationService: PaginationService,
  ) {}

  @CareRecordChecklistAdminListDoc()
  @ResponsePaging('care-record-checklist.list')
  @PolicyAbilityProtected({
    subject: ENUM_POLICY_SUBJECT.USER,
    action: [ENUM_POLICY_ACTION.READ],
  })
  @PolicyRoleProtected(ENUM_POLICY_ROLE_TYPE.ADMIN)
  @UserProtected()
  @AuthJwtAccessProtected()
  @Get('/list')
  async list(
    @PaginationQuery({
      availableSearch: CARE_RECORD_CHECKLIST_DEFAULT_AVAILABLE_SEARCH,
      availableOrderBy: CARE_RECORD_CHECKLIST_DEFAULT_AVAILABLE_ORDER_BY,
    })
    { _search, _limit, _offset, _order }: PaginationListDto,
    @PaginationQueryFilterInEnum(
      'status',
      CARE_RECORD_CHECKLIST_DEFAULT_STATUS,
      ENUM_CARE_RECORD_CHECKLIST_STATUS,
    )
    status: Record<string, any>,
    @Query('careRecord', OptionalParseUUIDPipe)
    careRecordId: string,
  ): Promise<IResponsePaging<CareRecordChecklistListResponseDto>> {
    const find: Record<string, any> = {
      ..._search,
      ...status,
    };

    if (careRecordId) {
      find['careRecord._id'] = careRecordId;
    }

    const careRecordChecklists =
      await this.careRecordChecklistService.findAllWithPopulate(find, {
        paging: {
          limit: _limit,
          offset: _offset,
        },
        order: _order,
      });

    const total: number =
      await this.careRecordChecklistService.getTotalWithPopulate(find);

    const totalPage: number = this.paginationService.totalPage(total, _limit);

    const mapped =
      this.careRecordChecklistService.mapList(careRecordChecklists);

    return {
      _pagination: {
        total,
        totalPage,
      },
      data: mapped,
    };
  }

  @CareRecordChecklistAdminParamsIdDoc()
  @Response('care-record-checklist.get')
  @PolicyAbilityProtected({
    subject: ENUM_POLICY_SUBJECT.USER,
    action: [ENUM_POLICY_ACTION.READ],
  })
  @PolicyRoleProtected(ENUM_POLICY_ROLE_TYPE.ADMIN)
  @UserProtected()
  @AuthJwtAccessProtected()
  @Get('/get/:id')
  async get(
    @Param('id', RequestRequiredPipe, CareRecordChecklistParsePipe)
    careRecordChecklist: CareRecordChecklistDoc,
  ): Promise<IResponse<CareRecordChecklistGetResponseDto>> {
    const careRecordChecklistFull: ICareRecordChecklistDoc =
      await this.careRecordChecklistService.join(careRecordChecklist);

    const mapped: CareRecordChecklistGetResponseDto =
      this.careRecordChecklistService.mapGet(careRecordChecklistFull);
    return { data: mapped };
  }

  @CareRecordChecklistAdminCreateDoc()
  @Response('care-record-checklist.create')
  @PolicyAbilityProtected({
    subject: ENUM_POLICY_SUBJECT.USER,
    action: [ENUM_POLICY_ACTION.READ],
  })
  @PolicyRoleProtected(ENUM_POLICY_ROLE_TYPE.ADMIN)
  @UserProtected()
  @AuthJwtAccessProtected()
  @Post('/create')
  async create(
    @AuthJwtPayload('user') createdBy: string,
    @Body() body: CareRecordChecklistCreateRequestDto,
  ): Promise<IResponse<DatabaseIdResponseDto>> {
    const promises: Promise<any>[] = [
      this.careRecordService.findOneById(body.careRecord),
      this.serviceChecklistService.findOneById(body.serviceChecklist),
    ];
    const [checkCareRecord, checkServiceChecklist] =
      await Promise.all(promises);

    if (!checkCareRecord) {
      throw new NotFoundException({
        statusCode: ENUM_CARE_RECORD_STATUS_CODE_ERROR.NOT_FOUND,
        message: 'care-record.error.notFound',
      });
    } else if (!checkServiceChecklist) {
      throw new NotFoundException({
        statusCode: ENUM_SERVICE_CHECKLIST_STATUS_CODE_ERROR.NOT_FOUND,
        message: 'service-checklist.error.notFound',
      });
    }

    try {
      const created = await this.careRecordChecklistService.create(body, {
        actionBy: createdBy,
      } as IDatabaseCreateOptions);
      return { data: { _id: created._id } };
    } catch (err: unknown) {
      throw new InternalServerErrorException({
        statusCode: ENUM_APP_STATUS_CODE_ERROR.UNKNOWN,
        message: 'http.serverError.internalServerError',
        _error: err,
      });
    }
  }

  @CareRecordChecklistAdminUpdateDoc()
  @Response('care-record-checklist.update')
  @PolicyAbilityProtected({
    subject: ENUM_POLICY_SUBJECT.USER,
    action: [ENUM_POLICY_ACTION.READ],
  })
  @PolicyRoleProtected(ENUM_POLICY_ROLE_TYPE.ADMIN)
  @UserProtected()
  @AuthJwtAccessProtected()
  @Put('/update/:id')
  async update(
    @Param('id', RequestRequiredPipe, CareRecordChecklistParsePipe)
    CareRecordChecklist: CareRecordChecklistDoc,
    @AuthJwtPayload('user') updatedBy: string,
    @Body() body: CareRecordChecklistUpdateRequestDto,
  ): Promise<void> {
    try {
      await this.careRecordChecklistService.update(CareRecordChecklist, body, {
        actionBy: updatedBy,
      });
    } catch (err: unknown) {
      throw new InternalServerErrorException({
        statusCode: ENUM_APP_STATUS_CODE_ERROR.UNKNOWN,
        message: 'http.serverError.internalServerError',
        _error: err,
      });
    }
  }

  @CareRecordChecklistAdminUpdateStatusDoc()
  @Response('care-record-checklist.updateStatus')
  @PolicyAbilityProtected({
    subject: ENUM_POLICY_SUBJECT.USER,
    action: [ENUM_POLICY_ACTION.READ],
  })
  @PolicyRoleProtected(ENUM_POLICY_ROLE_TYPE.ADMIN)
  @UserProtected()
  @AuthJwtAccessProtected()
  @Patch('/update/:id/status')
  async updateStatus(
    @Param('id', RequestRequiredPipe, CareRecordChecklistParsePipe)
    CareRecordChecklist: CareRecordChecklistDoc,
    @AuthJwtPayload('user') updatedBy: string,
    @Body() { status }: CareRecordChecklistUpdateStatusRequestDto,
  ): Promise<IResponse<void>> {
    try {
      await this.careRecordChecklistService.updateStatus(
        CareRecordChecklist,
        { status },
        {
          actionBy: updatedBy,
        } as IDatabaseSaveOptions,
      );
      return {
        _metadata: {
          customProperty: {
            messageProperties: {
              status: status.toLowerCase(),
            },
          },
        },
      };
    } catch (err: unknown) {
      throw new InternalServerErrorException({
        statusCode: ENUM_APP_STATUS_CODE_ERROR.UNKNOWN,
        message: 'care-record-checklist.error.updateStatusFailed',
        _error: err,
      });
    }
  }

  @CareRecordChecklistAdminDeleteDoc()
  @Response('care-record-checklist.delete')
  @PolicyAbilityProtected({
    subject: ENUM_POLICY_SUBJECT.USER,
    action: [ENUM_POLICY_ACTION.READ],
  })
  @PolicyRoleProtected(ENUM_POLICY_ROLE_TYPE.ADMIN)
  @UserProtected()
  @AuthJwtAccessProtected()
  @Delete('/delete/:id')
  async delete(
    @Param('id', RequestRequiredPipe, CareRecordChecklistParsePipe)
    careRecordChecklist: CareRecordChecklistDoc,
  ): Promise<IResponse<void>> {
    try {
      await this.careRecordChecklistService.softDelete(
        careRecordChecklist,
        {} as IDatabaseDeleteOptions,
      );
      return {};
    } catch (err) {
      throw new InternalServerErrorException({
        message: 'care-record-checklist.error.deleteFailed',
        _error: err,
      });
    }
  }
}
