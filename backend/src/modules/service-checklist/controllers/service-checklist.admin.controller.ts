import {
  Body,
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Query,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ServiceChecklistService } from '../services/service-checklist.service';
import { ServiceChecklistCreateRequestDto } from '../dtos/request/service-checklist.create.request.dto';
import { ServiceChecklistUpdateRequestDto } from '../dtos/request/service-checklist.update.request.dto';
import {
  Response,
  ResponsePaging,
} from '@/common/response/decorators/response.decorator';
import {
  IResponseReturn,
  IResponsePagingReturn,
} from '@/common/response/interfaces/response.interface';
import { ServiceChecklistListResponseDto } from '../dtos/response/service-checklist.list.response.dto';
import { ServiceChecklistDto } from '../dtos/service-checklist.dto';
import { PaginationOffsetQuery } from '@/common/pagination/decorators/pagination.decorator';
import { IPaginationQueryOffsetParams } from '@/common/pagination/interfaces/pagination.interface';
import {
  ServiceChecklistAdminCreateDoc,
  ServiceChecklistAdminDeleteDoc,
  ServiceChecklistAdminListDoc,
  ServiceChecklistAdminParamsIdDoc,
  ServiceChecklistAdminUpdateDoc,
} from '../docs/service-checklist.admin.doc';
import { DatabaseIdDto } from '@/common/database/dtos/database.id.response.dto';
import { AuthJwtAccessProtected } from '@/modules/auth/decorators/auth.jwt.decorator';
import { UserProtected } from '@/modules/user/decorators/user.decorator';
import { EnumRoleType } from '@/modules/policy/enums/policy.enum';
import {
  SERVICE_CHECKLIST_DEFAULT_AVAILABLE_ORDER_BY,
  SERVICE_CHECKLIST_DEFAULT_AVAILABLE_SEARCH,
} from '../constants/service-checklist.list.constant';
import { ENUM_VEHICLE_MODEL_TYPE } from '@/modules/vehicle-model/enums/vehicle-model.enum';
import { RequestOptionalParseUUIDPipe } from '@/common/request/pipes/request.optional-parse-uuid.pipe';
import { RoleProtected } from '@/modules/role/decorators/role.decorator';
import { RequestRequiredPipe } from '@/common/request/pipes/request.required.pipe';
import { RequestIsValidUuidPipe } from '@/common/request/pipes/request.is-valid-uuid.pipe';
import { ServiceChecklistUtil } from '../utils/service-checklist.util';
import { PaginationUtil } from '@/common/pagination/utils/pagination.util';

@ApiTags('modules.admin.service-checklist')
@Controller({
  version: '1',
  path: '/service-checklist',
})
export class ServiceChecklistAdminController {
  constructor(
    private readonly serviceChecklistService: ServiceChecklistService,
    private readonly serviceChecklistUtil: ServiceChecklistUtil,
    private readonly paginationUtil: PaginationUtil,
  ) {}

  @ServiceChecklistAdminListDoc()
  @ResponsePaging('service-checklist.list')
  @RoleProtected(EnumRoleType.admin)
  @UserProtected()
  @AuthJwtAccessProtected()
  @Get('/list')
  async list(
    @PaginationOffsetQuery({
      availableSearch: SERVICE_CHECKLIST_DEFAULT_AVAILABLE_SEARCH,
      availableOrderBy: SERVICE_CHECKLIST_DEFAULT_AVAILABLE_ORDER_BY,
    })
    pagination: IPaginationQueryOffsetParams,
    @Query('careArea', RequestOptionalParseUUIDPipe)
    careAreaId: string,
    @Query('vehicleType') vehicleType: ENUM_VEHICLE_MODEL_TYPE,
  ): Promise<IResponsePagingReturn<ServiceChecklistListResponseDto>> {
    const filters: Record<string, any> = {};

    if (careAreaId) {
      filters['careArea'] = careAreaId;
    }

    if (vehicleType) {
      filters['vehicleType'] = { $in: [vehicleType] };
    }

    const { data, total } = await this.serviceChecklistService.getListOffset(
      pagination,
      filters,
    );
    const mapped = this.serviceChecklistUtil.mapList(data);
    return this.paginationUtil.formatOffset(mapped, total, pagination);
  }

  @ServiceChecklistAdminParamsIdDoc()
  @Response('service-checklist.get')
  @RoleProtected(EnumRoleType.admin)
  @UserProtected()
  @AuthJwtAccessProtected()
  @Get('/get/:id')
  async get(
    @Param('id', RequestRequiredPipe, RequestIsValidUuidPipe) id: string,
  ): Promise<IResponseReturn<ServiceChecklistDto>> {
    const serviceChecklist = await this.serviceChecklistService.findOneById(id);
    return {
      data: this.serviceChecklistUtil.mapGet(serviceChecklist),
    };
  }

  @ServiceChecklistAdminCreateDoc()
  @Response('service-checklist.create')
  @RoleProtected(EnumRoleType.admin)
  @UserProtected()
  @AuthJwtAccessProtected()
  @Post('/create')
  async create(
    @Body() body: ServiceChecklistCreateRequestDto,
  ): Promise<IResponseReturn<DatabaseIdDto>> {
    const created = await this.serviceChecklistService.create(body);
    return { data: { _id: created._id } };
  }

  @ServiceChecklistAdminUpdateDoc()
  @Response('service-checklist.update')
  @RoleProtected(EnumRoleType.admin)
  @UserProtected()
  @AuthJwtAccessProtected()
  @Put('/update/:id')
  async update(
    @Param('id', RequestRequiredPipe, RequestIsValidUuidPipe) id: string,
    @Body() body: ServiceChecklistUpdateRequestDto,
  ): Promise<IResponseReturn<void>> {
    await this.serviceChecklistService.update(id, body);
    return {};
  }

  @ServiceChecklistAdminDeleteDoc()
  @Response('service-checklist.delete')
  @RoleProtected(EnumRoleType.admin)
  @UserProtected()
  @AuthJwtAccessProtected()
  @Delete('/delete/:id')
  async delete(
    @Param('id', RequestRequiredPipe, RequestIsValidUuidPipe) id: string,
  ): Promise<IResponseReturn<void>> {
    await this.serviceChecklistService.delete(id);
    return {};
  }
}
