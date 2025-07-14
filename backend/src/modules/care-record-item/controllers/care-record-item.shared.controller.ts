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
import { CareRecordItemService } from '../services/care-record-item.service';
import { CareRecordItemCreateRequestDto } from '../dtos/request/care-record-item.create.request.dto';
import { CareRecordItemUpdateRequestDto } from '../dtos/request/care-record-item.update.request.dto';
import { PaginationListDto } from '@/common/pagination/dtos/pagination.list.dto';
import {
  Response,
  ResponsePaging,
} from '@/common/response/decorators/response.decorator';
import {
  IResponse,
  IResponsePaging,
} from '@/common/response/interfaces/response.interface';
import { CareRecordItemListResponseDto } from '../dtos/response/care-record-item.list.response.dto';
import { CareRecordItemGetResponseDto } from '../dtos/response/care-record-item.get.response.dto';
import {
  IDatabaseCreateOptions,
  IDatabaseDeleteOptions,
  IDatabaseSaveOptions,
} from '@/common/database/interfaces/database.interface';
import { PaginationQuery } from '@/common/pagination/decorators/pagination.decorator';
import { PaginationService } from '@/common/pagination/services/pagination.service';
import {
  CareRecordItemSharedCreateDoc,
  CareRecordItemSharedDeleteDoc,
  CareRecordItemSharedListDoc,
  CareRecordItemSharedParamsIdDoc,
  CareRecordItemSharedUpdateDoc,
  CareRecordItemSharedUpdateApprovalDoc,
} from '../docs/care-record-item.shared.doc';
import { DatabaseIdResponseDto } from '@/common/database/dtos/response/database.id.response.dto';
import { ENUM_CARE_RECORD_ITEM_STATUS_CODE_ERROR } from '../enums/care-record-item.status-code.enum';
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
  CARE_RECORD_ITEM_DEFAULT_AVAILABLE_ORDER_BY,
  CARE_RECORD_ITEM_DEFAULT_AVAILABLE_SEARCH,
} from '../constants/care-record-item.list.constant';
import { RequestRequiredPipe } from '@/common/request/pipes/request.required.pipe';
import { CareRecordItemParsePipe } from '../pipes/care-record-item.parse.pipe';
import { CareRecordItemDoc } from '../entities/care-record-item.entity';
import { ICareRecordItemDoc } from '../interfaces/care-record-item.interface';
import { OptionalParseUUIDPipe } from '@/app/pipes/optional-parse-uuid.pipe';
import { CareRecordItemUpdateApprovalRequestDto } from '../dtos/request/care-record-item.update-approval.request.dto';
import { CareRecordService } from '@/modules/care-record/services/care-record.service';
import { ServiceChecklistService } from '@/modules/service-checklist/services/service-checklist.service';
import { ENUM_CARE_RECORD_STATUS_CODE_ERROR } from '@/modules/care-record/enums/care-record.status-code.enum';
import { ENUM_SERVICE_CHECKLIST_STATUS_CODE_ERROR } from '@/modules/service-checklist/enums/service-checklist.status-code.enum';
import { VehicleServiceService } from '@/modules/vehicle-service/services/vehicle-service.service';
import { PartService } from '@/modules/part/services/part.services';
import { UserService } from '@/modules/user/services/user.service';
import { ENUM_USER_STATUS_CODE_ERROR } from '@/modules/user/enums/user.status-code.enum';

@ApiTags('modules.Shared.care-record-item')
@Controller({
  version: '1',
  path: '/care-record-item',
})
export class CareRecordItemSharedController {
  private readonly logger = new Logger(CareRecordItemSharedController.name);
  constructor(
    private readonly careRecordService: CareRecordService,
    private readonly vehicleServiceService: VehicleServiceService,
    private readonly partService: PartService,
    private readonly userService: UserService,
    private readonly careRecordItemService: CareRecordItemService,
    private readonly paginationService: PaginationService,
  ) {}

  @CareRecordItemSharedListDoc()
  @ResponsePaging('care-record-item.list')
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
      availableSearch: CARE_RECORD_ITEM_DEFAULT_AVAILABLE_SEARCH,
      availableOrderBy: CARE_RECORD_ITEM_DEFAULT_AVAILABLE_ORDER_BY,
    })
    { _search, _limit, _offset, _order }: PaginationListDto,
    @Query('careRecord', OptionalParseUUIDPipe)
    careRecordId: string,
  ): Promise<IResponsePaging<CareRecordItemListResponseDto>> {
    const find: Record<string, any> = {
      ..._search,
    };

    if (careRecordId) {
      find['careRecord._id'] = careRecordId;
    }

    const careRecordItems =
      await this.careRecordItemService.findAllWithPopulate(find, {
        paging: {
          limit: _limit,
          offset: _offset,
        },
        order: _order,
      });

    const total: number =
      await this.careRecordItemService.getTotalWithPopulate(find);

    const totalPage: number = this.paginationService.totalPage(total, _limit);

    const mapped = this.careRecordItemService.mapList(careRecordItems);

    return {
      _pagination: {
        total,
        totalPage,
      },
      data: mapped,
    };
  }

  @CareRecordItemSharedParamsIdDoc()
  @Response('care-record-item.get')
  @PolicyAbilityProtected({
    subject: ENUM_POLICY_SUBJECT.USER,
    action: [ENUM_POLICY_ACTION.READ],
  })
  @PolicyRoleProtected(ENUM_POLICY_ROLE_TYPE.ADMIN)
  @UserProtected()
  @AuthJwtAccessProtected()
  @Get('/get/:id')
  async get(
    @Param('id', RequestRequiredPipe, CareRecordItemParsePipe)
    CareRecordItem: CareRecordItemDoc,
  ): Promise<IResponse<CareRecordItemGetResponseDto>> {
    const CareRecordItemFull: ICareRecordItemDoc =
      await this.careRecordItemService.join(CareRecordItem);

    const mapped: CareRecordItemGetResponseDto =
      this.careRecordItemService.mapGet(CareRecordItemFull);
    return { data: mapped };
  }

  @CareRecordItemSharedCreateDoc()
  @Response('care-record-item.create')
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
    @Body() body: CareRecordItemCreateRequestDto,
  ): Promise<IResponse<DatabaseIdResponseDto>> {
    const promises: Promise<any>[] = [
      this.careRecordService.findOneById(body.careRecord),
      this.vehicleServiceService.findOneById(body.vehicleService),
      this.userService.findOneById(body.technician),
    ];
    const [checkCareRecord, checkVehicleService, checkTechnician] =
      await Promise.all(promises);

    if (!checkCareRecord) {
      throw new NotFoundException({
        statusCode: ENUM_CARE_RECORD_STATUS_CODE_ERROR.NOT_FOUND,
        message: 'care-record.error.notFound',
      });
    } else if (!checkVehicleService) {
      throw new NotFoundException({
        statusCode: ENUM_SERVICE_CHECKLIST_STATUS_CODE_ERROR.NOT_FOUND,
        message: 'service-checklist.error.notFound',
      });
    } else if (!checkTechnician) {
      throw new NotFoundException({
        statusCode: ENUM_USER_STATUS_CODE_ERROR.NOT_FOUND,
        message: 'user.error.notFound',
      });
    }

    try {
      const created = await this.careRecordItemService.create(body, {
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

  @CareRecordItemSharedUpdateDoc()
  @Response('care-record-item.update')
  @PolicyAbilityProtected({
    subject: ENUM_POLICY_SUBJECT.USER,
    action: [ENUM_POLICY_ACTION.READ],
  })
  @PolicyRoleProtected(ENUM_POLICY_ROLE_TYPE.ADMIN)
  @UserProtected()
  @AuthJwtAccessProtected()
  @Put('/update/:id')
  async update(
    @Param('id', RequestRequiredPipe, CareRecordItemParsePipe)
    CareRecordItem: CareRecordItemDoc,
    @AuthJwtPayload('user') updatedBy: string,
    @Body() body: CareRecordItemUpdateRequestDto,
  ): Promise<void> {
    try {
      await this.careRecordItemService.update(CareRecordItem, body, {
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

  @CareRecordItemSharedUpdateApprovalDoc()
  @Response('care-record-item.updateApproval')
  @PolicyAbilityProtected({
    subject: ENUM_POLICY_SUBJECT.USER,
    action: [ENUM_POLICY_ACTION.READ],
  })
  @PolicyRoleProtected(ENUM_POLICY_ROLE_TYPE.ADMIN)
  @UserProtected()
  @AuthJwtAccessProtected()
  @Patch('/update/:id/approval')
  async updateStatus(
    @Param('id', RequestRequiredPipe, CareRecordItemParsePipe)
    careRecordItem: CareRecordItemDoc,
    @AuthJwtPayload('user') updatedBy: string,
    @Body() { approvedByOwner }: CareRecordItemUpdateApprovalRequestDto,
  ): Promise<IResponse<void>> {
    try {
      await this.careRecordItemService.updateApproval(
        careRecordItem,
        { approvedByOwner },
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
        message: 'care-record-item.error.updateApprovalFailed',
        _error: err,
      });
    }
  }

  @CareRecordItemSharedDeleteDoc()
  @Response('care-record-item.delete')
  @PolicyAbilityProtected({
    subject: ENUM_POLICY_SUBJECT.USER,
    action: [ENUM_POLICY_ACTION.READ],
  })
  @PolicyRoleProtected(ENUM_POLICY_ROLE_TYPE.ADMIN)
  @UserProtected()
  @AuthJwtAccessProtected()
  @Delete('/delete/:id')
  async delete(
    @Param('id', RequestRequiredPipe, CareRecordItemParsePipe)
    careRecordItem: CareRecordItemDoc,
  ): Promise<IResponse<void>> {
    try {
      await this.careRecordItemService.softDelete(
        careRecordItem,
        {} as IDatabaseDeleteOptions,
      );
      return {};
    } catch (err) {
      throw new InternalServerErrorException({
        message: 'care-record-item.error.deleteFailed',
        _error: err,
      });
    }
  }
}
