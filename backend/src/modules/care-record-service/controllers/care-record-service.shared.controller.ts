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
import { CareRecordServiceService } from '../services/care-record-service.service';
import { CareRecordServiceCreateRequestDto } from '../dtos/request/care-record-service.create.request.dto';
import { CareRecordServiceUpdateRequestDto } from '../dtos/request/care-record-service.update.request.dto';
import { PaginationListDto } from '@/common/pagination/dtos/pagination.list.dto';
import {
  Response,
  ResponsePaging,
} from '@/common/response/decorators/response.decorator';
import {
  IResponse,
  IResponsePaging,
} from '@/common/response/interfaces/response.interface';
import { CareRecordServiceListResponseDto } from '../dtos/response/care-record-service.list.response.dto';
import { CareRecordServiceGetResponseDto } from '../dtos/response/care-record-service.get.response.dto';
import { CareRecordServiceWithChecklistsResponseDto } from '../dtos/response/care-record-service.with-checklists.response.dto';
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
  CareRecordServiceSharedCreateDoc,
  CareRecordServiceSharedDeleteDoc,
  CareRecordServiceSharedListDoc,
  CareRecordServiceSharedListWithChecklistsDoc,
  CareRecordServiceSharedParamsIdDoc,
  CareRecordServiceSharedUpdateDoc,
  CareRecordServiceSharedUpdateStatusDoc,
} from '../docs/care-record-service.shared.doc';
import { DatabaseIdResponseDto } from '@/common/database/dtos/response/database.id.response.dto';
import { ENUM_CARE_RECORD_SERVICE_STATUS_CODE_ERROR } from '../enums/care-record-service.status-code.enum';
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
import { ENUM_POLICY_ROLE_TYPE } from '@/modules/policy/enums/policy.enum';
import {
  CARE_RECORD_SERVICE_DEFAULT_AVAILABLE_ORDER_BY,
  CARE_RECORD_SERVICE_DEFAULT_AVAILABLE_SEARCH,
  CARE_RECORD_SERVICE_DEFAULT_STATUS,
} from '../constants/care-record-service.list.constant';
import { RequestRequiredPipe } from '@/common/request/pipes/request.required.pipe';
import { CareRecordServiceParsePipe } from '../pipes/care-record-service.parse.pipe';
import { CareRecordServiceDoc } from '../entities/care-record-service.entity';
import { ICareRecordServiceDoc } from '../interfaces/care-record-service.interface';
import { OptionalParseUUIDPipe } from '@/app/pipes/optional-parse-uuid.pipe';
import { ENUM_CARE_RECORD_SERVICE_STATUS } from '../enums/care-record-service.enum';
import { CareRecordServiceUpdateStatusRequestDto } from '../dtos/request/care-record-service.update-status.request.dto';
import { CareRecordService } from '@/modules/care-record/services/care-record.service';
import { ENUM_CARE_RECORD_STATUS_CODE_ERROR } from '@/modules/care-record/enums/care-record.status-code.enum';
import { VehicleServiceService } from '@/modules/vehicle-service/services/vehicle-service.service';
import { ENUM_VEHICLE_SERVICE_STATUS_CODE_ERROR } from '@/modules/vehicle-service/enums/vehicle-service.status-code.enum';

@ApiTags('modules.shared.care-record-service')
@Controller({
  version: '1',
  path: '/care-record-service',
})
export class CareRecordServiceSharedController {
  private readonly logger = new Logger(CareRecordServiceSharedController.name);
  constructor(
    private readonly careRecordService: CareRecordService,
    private readonly vehicleServiceService: VehicleServiceService,
    private readonly careRecordServiceService: CareRecordServiceService,
    private readonly paginationService: PaginationService,
  ) {}

  @CareRecordServiceSharedListDoc()
  @ResponsePaging('care-record-service.list')
  @PolicyRoleProtected(
    ENUM_POLICY_ROLE_TYPE.ADMIN,
    ENUM_POLICY_ROLE_TYPE.MANAGER,
    ENUM_POLICY_ROLE_TYPE.TECHNICIAN,
  )
  @UserProtected()
  @AuthJwtAccessProtected()
  @Get('/list')
  async list(
    @PaginationQuery({
      availableSearch: CARE_RECORD_SERVICE_DEFAULT_AVAILABLE_SEARCH,
      availableOrderBy: CARE_RECORD_SERVICE_DEFAULT_AVAILABLE_ORDER_BY,
    })
    { _search, _limit, _offset, _order }: PaginationListDto,
    @PaginationQueryFilterInEnum(
      'status',
      CARE_RECORD_SERVICE_DEFAULT_STATUS,
      ENUM_CARE_RECORD_SERVICE_STATUS,
    )
    status: Record<string, any>,
    @Query('careRecord', OptionalParseUUIDPipe)
    careRecord?: string,
  ): Promise<IResponsePaging<CareRecordServiceListResponseDto>> {
    const find: Record<string, any> = {
      ..._search,
      ...status,
    };

    if (careRecord) {
      find['careRecord'] = careRecord; //careAreaId
    }

    const careRecordServices =
      await this.careRecordServiceService.findAllWithPopulate(find, {
        paging: {
          limit: _limit,
          offset: _offset,
        },
        order: _order,
      });

    const total: number =
      await this.careRecordServiceService.getTotalWithPopulate(find);

    const totalPage: number = this.paginationService.totalPage(total, _limit);

    const mapped = this.careRecordServiceService.mapList(careRecordServices);

    return {
      _pagination: {
        total,
        totalPage,
      },
      data: mapped,
    };
  }

  @CareRecordServiceSharedListWithChecklistsDoc()
  @ResponsePaging('care-record-service.listWithChecklists')
  @PolicyRoleProtected(
    ENUM_POLICY_ROLE_TYPE.ADMIN,
    ENUM_POLICY_ROLE_TYPE.MANAGER,
    ENUM_POLICY_ROLE_TYPE.TECHNICIAN,
  )
  @UserProtected()
  @AuthJwtAccessProtected()
  @Get('/list/checklists')
  async listWithChecklists(
    @PaginationQuery({
      availableSearch: CARE_RECORD_SERVICE_DEFAULT_AVAILABLE_SEARCH,
      availableOrderBy: CARE_RECORD_SERVICE_DEFAULT_AVAILABLE_ORDER_BY,
    })
    { _search, _limit, _offset, _order }: PaginationListDto,
    @PaginationQueryFilterInEnum(
      'status',
      CARE_RECORD_SERVICE_DEFAULT_STATUS,
      ENUM_CARE_RECORD_SERVICE_STATUS,
    )
    status: Record<string, any>,
    @Query('careRecord', OptionalParseUUIDPipe)
    careRecordId: string,
  ): Promise<IResponsePaging<CareRecordServiceWithChecklistsResponseDto>> {
    const find: Record<string, any> = {
      ..._search,
      ...status,
    };

    if (careRecordId) {
      find['careRecord'] = careRecordId;
    }

    const careRecordServicesWithChecklists =
      await this.careRecordServiceService.findAllWithChecklists(find, {
        paging: {
          limit: _limit,
          offset: _offset,
        },
        order: _order,
      });

    const total: number = await this.careRecordServiceService.getTotal(find);
    const totalPage: number = this.paginationService.totalPage(total, _limit);

    return {
      _pagination: {
        total,
        totalPage,
      },
      data: careRecordServicesWithChecklists,
    };
  }

  @CareRecordServiceSharedParamsIdDoc()
  @Response('care-record-service.get')
  @PolicyRoleProtected(
    ENUM_POLICY_ROLE_TYPE.ADMIN,
    ENUM_POLICY_ROLE_TYPE.MANAGER,
    ENUM_POLICY_ROLE_TYPE.TECHNICIAN,
  )
  @UserProtected()
  @AuthJwtAccessProtected()
  @Get('/get/:id')
  async get(
    @Param('id', RequestRequiredPipe, CareRecordServiceParsePipe)
    careRecordService: CareRecordServiceDoc,
  ): Promise<IResponse<CareRecordServiceGetResponseDto>> {
    const careRecordServiceFull: ICareRecordServiceDoc =
      await this.careRecordServiceService.join(careRecordService);

    const mapped: CareRecordServiceGetResponseDto =
      this.careRecordServiceService.mapGet(careRecordServiceFull);
    return { data: mapped };
  }

  @CareRecordServiceSharedCreateDoc()
  @Response('care-record-service.create')
  @PolicyRoleProtected(
    ENUM_POLICY_ROLE_TYPE.ADMIN,
    ENUM_POLICY_ROLE_TYPE.MANAGER,
    ENUM_POLICY_ROLE_TYPE.TECHNICIAN,
  )
  @UserProtected()
  @AuthJwtAccessProtected()
  @Post('/create')
  async create(
    @AuthJwtPayload('user') createdBy: string,
    @Body() body: CareRecordServiceCreateRequestDto,
  ): Promise<IResponse<DatabaseIdResponseDto>> {
    const checkCareRecord = await this.careRecordService.findOneById(
      body.careRecord,
    );
    if (!checkCareRecord) {
      throw new NotFoundException({
        statusCode: ENUM_CARE_RECORD_STATUS_CODE_ERROR.NOT_FOUND,
        message: 'care-record.error.notFound',
      });
    }

    if (body.vehicleService) {
      const checkVehiceService = await this.vehicleServiceService.findOneById(
        body.vehicleService,
      );

      if (!checkVehiceService) {
        throw new NotFoundException({
          statusCode: ENUM_VEHICLE_SERVICE_STATUS_CODE_ERROR.NOT_FOUND,
          message: 'vehicle-service.error.notFound',
        });
      }
    }
    try {
      const created = await this.careRecordServiceService.create(body, {
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

  @CareRecordServiceSharedUpdateDoc()
  @Response('care-record-service.update')
  @PolicyRoleProtected(
    ENUM_POLICY_ROLE_TYPE.ADMIN,
    ENUM_POLICY_ROLE_TYPE.MANAGER,
    ENUM_POLICY_ROLE_TYPE.TECHNICIAN,
  )
  @UserProtected()
  @AuthJwtAccessProtected()
  @Put('/update/:id')
  async update(
    @Param('id', RequestRequiredPipe, CareRecordServiceParsePipe)
    CareRecordService: CareRecordServiceDoc,
    @AuthJwtPayload('user') updatedBy: string,
    @Body() body: CareRecordServiceUpdateRequestDto,
  ): Promise<void> {
    try {
      await this.careRecordServiceService.update(CareRecordService, body, {
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

  @CareRecordServiceSharedUpdateStatusDoc()
  @Response('care-record-service.updateStatus')
  @PolicyRoleProtected(
    ENUM_POLICY_ROLE_TYPE.ADMIN,
    ENUM_POLICY_ROLE_TYPE.MANAGER,
    ENUM_POLICY_ROLE_TYPE.TECHNICIAN,
  )
  @UserProtected()
  @AuthJwtAccessProtected()
  @Patch('/update/:id/status')
  async updateStatus(
    @Param('id', RequestRequiredPipe, CareRecordServiceParsePipe)
    careRecordService: CareRecordServiceDoc,
    @AuthJwtPayload('user') updatedBy: string,
    @Body() { status }: CareRecordServiceUpdateStatusRequestDto,
  ): Promise<IResponse<void>> {
    try {
      await this.careRecordServiceService.updateStatus(
        careRecordService,
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
        message: 'care-record-Service.error.updateStatusFailed',
        _error: err,
      });
    }
  }

  @CareRecordServiceSharedDeleteDoc()
  @Response('care-record-service.delete')
  @PolicyRoleProtected(
    ENUM_POLICY_ROLE_TYPE.ADMIN,
    ENUM_POLICY_ROLE_TYPE.MANAGER,
    ENUM_POLICY_ROLE_TYPE.TECHNICIAN,
  )
  @UserProtected()
  @AuthJwtAccessProtected()
  @Delete('/delete/:id')
  async delete(
    @Param('id', RequestRequiredPipe, CareRecordServiceParsePipe)
    careRecordService: CareRecordServiceDoc,
  ): Promise<IResponse<void>> {
    try {
      await this.careRecordServiceService.softDelete(
        careRecordService,
        {} as IDatabaseDeleteOptions,
      );
      return {};
    } catch (err) {
      throw new InternalServerErrorException({
        message: 'care-record-service.error.deleteFailed',
        _error: err,
      });
    }
  }
}
