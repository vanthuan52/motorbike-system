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
import { CareRecordService } from '../services/care-record.service';
import { CareRecordCreateRequestDto } from '../dtos/request/care-record.create.request.dto';
import { CareRecordUpdateRequestDto } from '../dtos/request/care-record.update.request.dto';
import { PaginationListDto } from '@/common/pagination/dtos/pagination.list.dto';
import {
  Response,
  ResponsePaging,
} from '@/common/response/decorators/response.decorator';
import {
  IResponse,
  IResponsePaging,
} from '@/common/response/interfaces/response.interface';
import {
  ModelCareRecordListResponseDto,
  CareRecordListResponseDto,
} from '../dtos/response/care-record.list.response.dto';
import { CareRecordGetResponseDto } from '../dtos/response/care-record.get.response.dto';
import {
  IDatabaseCreateOptions,
  IDatabaseDeleteOptions,
  IDatabaseSaveOptions,
} from '@/common/database/interfaces/database.interface';
import { PaginationQuery } from '@/common/pagination/decorators/pagination.decorator';
import { PaginationService } from '@/common/pagination/services/pagination.service';
import {
  CareRecordAdminCreateDoc,
  CareRecordAdminDeleteDoc,
  CareRecordAdminListCombinedByServiceDoc,
  CareRecordAdminListCombinedDoc,
  CareRecordAdminListDoc,
  CareRecordAdminListHistoryDoc,
  CareRecordAdminParamsIdDoc,
  CareRecordAdminUpdateDoc,
} from '../docs/care-record.admin.doc';
import { DatabaseIdResponseDto } from '@/common/database/dtos/response/database.id.response.dto';
import { ENUM_SERVICE_PRICE_STATUS_CODE_ERROR } from '../enums/care-record.status-code.enum';
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
  SERVICE_PRICE_DEFAULT_AVAILABLE_ORDER_BY,
  SERVICE_PRICE_DEFAULT_AVAILABLE_SEARCH,
} from '../constants/care-record.list.constant';
import { RequestRequiredPipe } from '@/common/request/pipes/request.required.pipe';
import { CareRecordParsePipe } from '../pipes/care-record.parse.pipe';
import { CareRecordDoc } from '../entities/care-record.entity';
import {
  IModelCareRecord,
  ICareRecordDoc,
} from '../interfaces/care-record.interface';
import { OptionalParseUUIDPipe } from '@/app/pipes/optional-parse-uuid.pipe';
import { VehicleServiceService } from '@/modules/vehicle-service/services/vehicle-service.service';
import { VehicleModelService } from '@/modules/vehicle-model/services/vehicle-model.service';
import { ENUM_CARE_RECORD_STATUS } from '../enums/care-record.enum';

@ApiTags('modules.admin.care-record')
@Controller({
  version: '1',
  path: '/care-record',
})
export class CareRecordAdminController {
  private readonly logger = new Logger(CareRecordAdminController.name);
  constructor(
    private readonly vehicleServiceService: VehicleServiceService,
    private readonly vehicleModelService: VehicleModelService,
    private readonly CareRecordService: CareRecordService,
    private readonly paginationService: PaginationService,
  ) {}

  @CareRecordAdminListDoc()
  @ResponsePaging('care-record.list')
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
      availableSearch: SERVICE_PRICE_DEFAULT_AVAILABLE_SEARCH,
      availableOrderBy: SERVICE_PRICE_DEFAULT_AVAILABLE_ORDER_BY,
    })
    { _search, _limit, _offset, _order }: PaginationListDto,
    @Query('vehicleService', OptionalParseUUIDPipe)
    vehicleServiceId: string,
    @Query('vehicleModel', OptionalParseUUIDPipe)
    vehicleModelId: string,
  ): Promise<IResponsePaging<CareRecordListResponseDto>> {
    const find: Record<string, any> = {
      ..._search,
    };

    if (vehicleServiceId) {
      find['vehicleService'] = vehicleServiceId;
    }

    if (vehicleModelId) {
      find['vehicleModel'] = vehicleModelId;
    }

    this.logger.log(`find: ${JSON.stringify(find)}`);
    const CareRecords =
      await this.CareRecordService.findAllWithVehicleServiceAndVehicleModel(
        find,
        {
          paging: {
            limit: _limit,
            offset: _offset,
          },
          order: _order,
        },
      );

    const total: number =
      await this.CareRecordService.getTotalWithVehicleServiceAndVehicleModel(
        find,
      );

    const totalPage: number = this.paginationService.totalPage(total, _limit);

    const mapped = this.CareRecordService.mapList(CareRecords);

    return {
      _pagination: {
        total,
        totalPage,
      },
      data: mapped,
    };
  }

  @CareRecordAdminParamsIdDoc()
  @Response('care-record.get')
  @PolicyAbilityProtected({
    subject: ENUM_POLICY_SUBJECT.USER,
    action: [ENUM_POLICY_ACTION.READ],
  })
  @PolicyRoleProtected(ENUM_POLICY_ROLE_TYPE.ADMIN)
  @UserProtected()
  @AuthJwtAccessProtected()
  @Get('/get/:id')
  async get(
    @Param('id', RequestRequiredPipe, CareRecordParsePipe)
    CareRecord: CareRecordDoc,
  ): Promise<IResponse<CareRecordGetResponseDto>> {
    const CareRecordFull: ICareRecordDoc =
      await this.CareRecordService.join(CareRecord);

    const mapped: CareRecordGetResponseDto =
      this.CareRecordService.mapGet(CareRecordFull);
    return { data: mapped };
  }

  @CareRecordAdminCreateDoc()
  @Response('care-record.create')
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
    @Body() body: CareRecordCreateRequestDto,
  ): Promise<IResponse<DatabaseIdResponseDto>> {
    const promises: Promise<any>[] = [
      this.vehicleServiceService.findOneById(body.vehicleService),
      this.vehicleModelService.findOneById(body.vehicleModel),
    ];
    const [checkVehicleService, checkVehicleModel] =
      await Promise.all(promises);

    if (!checkVehicleService) {
      throw new NotFoundException({
        statusCode: ENUM_SERVICE_PRICE_STATUS_CODE_ERROR.NOT_FOUND,
        message: 'vehicle-service.error.notFound',
      });
    } else if (!checkVehicleModel) {
      throw new NotFoundException({
        statusCode: ENUM_SERVICE_PRICE_STATUS_CODE_ERROR.NOT_FOUND,
        message: 'vehicle-model-type.error.notFound',
      });
    }

    try {
      const created = await this.CareRecordService.create(body, {
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

  @CareRecordAdminUpdateDoc()
  @Response('care-record.update')
  @PolicyAbilityProtected({
    subject: ENUM_POLICY_SUBJECT.USER,
    action: [ENUM_POLICY_ACTION.READ],
  })
  @PolicyRoleProtected(ENUM_POLICY_ROLE_TYPE.ADMIN)
  @UserProtected()
  @AuthJwtAccessProtected()
  @Put('/update/:id')
  async update(
    @Param('id', RequestRequiredPipe, CareRecordParsePipe)
    CareRecord: CareRecordDoc,
    @AuthJwtPayload('user') updatedBy: string,
    @Body() body: CareRecordUpdateRequestDto,
  ): Promise<void> {
    try {
      await this.CareRecordService.update(CareRecord, body);
    } catch (err: unknown) {
      throw new InternalServerErrorException({
        statusCode: ENUM_APP_STATUS_CODE_ERROR.UNKNOWN,
        message: 'http.serverError.internalServerError',
        _error: err,
      });
    }
  }

  @CareRecordAdminDeleteDoc()
  @Response('care-record.delete')
  @PolicyAbilityProtected({
    subject: ENUM_POLICY_SUBJECT.USER,
    action: [ENUM_POLICY_ACTION.READ],
  })
  @PolicyRoleProtected(ENUM_POLICY_ROLE_TYPE.ADMIN)
  @UserProtected()
  @AuthJwtAccessProtected()
  @Delete('/delete/:id')
  async delete(
    @Param('id', RequestRequiredPipe, CareRecordParsePipe)
    CareRecord: CareRecordDoc,
  ): Promise<IResponse<void>> {
    try {
      await this.CareRecordService.delete(
        CareRecord,
        {} as IDatabaseDeleteOptions,
      );
      return {};
    } catch (err) {
      throw new InternalServerErrorException({
        message: 'care-record.error.deleteFailed',
        _error: err,
      });
    }
  }

  @CareRecordAdminListHistoryDoc()
  @ResponsePaging('care-record.listHistory')
  @PolicyAbilityProtected({
    subject: ENUM_POLICY_SUBJECT.USER,
    action: [ENUM_POLICY_ACTION.READ],
  })
  @PolicyRoleProtected(ENUM_POLICY_ROLE_TYPE.ADMIN)
  @UserProtected()
  @AuthJwtAccessProtected()
  @Get('/list/history/:vehicleServiceId/:vehicleModelId')
  async listHistory(
    @PaginationQuery({
      availableSearch: SERVICE_PRICE_DEFAULT_AVAILABLE_SEARCH,
      availableOrderBy: SERVICE_PRICE_DEFAULT_AVAILABLE_ORDER_BY,
    })
    { _search, _limit, _offset, _order }: PaginationListDto,
    @Param('vehicleServiceId', RequestRequiredPipe)
    vehicleServiceId: string,
    @Param('vehicleModelId', RequestRequiredPipe)
    vehicleModelId: string,
  ): Promise<IResponsePaging<CareRecordListResponseDto>> {
    const find: Record<string, any> = {
      ..._search,
      vehicleService: vehicleServiceId,
      vehicleModel: vehicleModelId,
    };

    const CareRecords =
      await this.CareRecordService.findAllWithVehicleServiceAndVehicleModel(
        find,
        {
          paging: {
            limit: _limit,
            offset: _offset,
          },
          order: _order,
        },
      );

    const total: number =
      await this.CareRecordService.getTotalWithVehicleServiceAndVehicleModel(
        find,
      );

    const totalPage: number = this.paginationService.totalPage(total, _limit);

    const mapped = this.CareRecordService.mapList(CareRecords);

    return {
      _pagination: {
        total,
        totalPage,
      },
      data: mapped,
    };
  }
}
