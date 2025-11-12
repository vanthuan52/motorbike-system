import {
  Controller,
  Get,
  Logger,
  NotFoundException,
  Param,
  Query,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ServiceChecklistService } from '../services/service-checklist.service';
import { PaginationListDto } from '@/common/pagination/dtos/pagination.list.dto';
import {
  Response,
  ResponsePaging,
} from '@/common/response/decorators/response.decorator';
import {
  IResponse,
  IResponsePaging,
} from '@/common/response/interfaces/response.interface';
import { ServiceChecklistListResponseDto } from '../dtos/response/service-checklist.list.response.dto';
import { PaginationQuery } from '@/common/pagination/decorators/pagination.decorator';
import { PaginationService } from '@/common/pagination/services/pagination.service';
import { ServiceChecklistSharedListDoc } from '../docs/service-checklist.shared.doc';
import { AuthJwtAccessProtected } from '@/modules/auth/decorators/auth.jwt.decorator';
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
import { ENUM_VEHICLE_MODEL_TYPE } from '@/modules/vehicle-model/enums/vehicle-model.enum';
import {
  SERVICE_CHECKLIST_DEFAULT_AVAILABLE_ORDER_BY,
  SERVICE_CHECKLIST_DEFAULT_AVAILABLE_SEARCH,
} from '../constants/service-checklist.list.constant';
import { ServiceChecklistAdminParamsIdDoc } from '../docs/service-checklist.admin.doc';
import { ServiceChecklistGetResponseDto } from '../dtos/response/service-checklist.get.response.dto';

@ApiTags('modules.shared.service-checklist')
@Controller({
  version: '1',
  path: '/service-checklist',
})
export class ServiceChecklistSharedController {
  private readonly logger = new Logger(ServiceChecklistSharedController.name);
  constructor(
    private readonly serviceChecklistService: ServiceChecklistService,
    private readonly paginationService: PaginationService,
  ) {}

  @ServiceChecklistSharedListDoc()
  @ResponsePaging('service-checklist.list')
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
      availableSearch: SERVICE_CHECKLIST_DEFAULT_AVAILABLE_SEARCH,
      availableOrderBy: SERVICE_CHECKLIST_DEFAULT_AVAILABLE_ORDER_BY,
    })
    { _search, _limit, _offset, _order }: PaginationListDto,
    @Query('vehicleType') vehicleType?: ENUM_VEHICLE_MODEL_TYPE,
  ): Promise<IResponsePaging<ServiceChecklistListResponseDto>> {
    const find: Record<string, any> = {
      ..._search,
    };

    // Filter by vehicle type if provided
    if (vehicleType) {
      find.vehicleType = { $in: [vehicleType] };
    }

    const serviceChecklists = await this.serviceChecklistService.findAll(find, {
      paging: {
        limit: _limit,
        offset: _offset,
      },
      order: _order,
    });

    const total: number = await this.serviceChecklistService.getTotal(find);

    const totalPage: number = this.paginationService.totalPage(total, _limit);

    const mapped = this.serviceChecklistService.mapList(serviceChecklists);

    return {
      _pagination: {
        total,
        totalPage,
      },
      data: mapped,
    };
  }

  @ServiceChecklistAdminParamsIdDoc()
  @Response('service-checklist.get')
  @PolicyRoleProtected(
    ENUM_POLICY_ROLE_TYPE.ADMIN,
    ENUM_POLICY_ROLE_TYPE.MANAGER,
    ENUM_POLICY_ROLE_TYPE.TECHNICIAN,
  )
  @UserProtected()
  @AuthJwtAccessProtected()
  @Get('/get/:id')
  async get(
    @Param('id') id: string,
  ): Promise<IResponse<ServiceChecklistGetResponseDto>> {
    const ServiceChecklist = await this.serviceChecklistService.findOneById(id);
    if (!ServiceChecklist) {
      throw new NotFoundException({
        message: 'service-checklist.error.notFound',
      });
    }
    const mapped = this.serviceChecklistService.mapGet(ServiceChecklist);
    return { data: mapped };
  }
}
