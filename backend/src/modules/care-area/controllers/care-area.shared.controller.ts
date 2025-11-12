import {
  Controller,
  Get,
  NotFoundException,
  Param,
  Query,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CareAreaService } from '../services/care-area.service';
import { PaginationListDto } from '@/common/pagination/dtos/pagination.list.dto';
import {
  Response,
  ResponsePaging,
} from '@/common/response/decorators/response.decorator';
import {
  IResponse,
  IResponsePaging,
} from '@/common/response/interfaces/response.interface';
import { CareAreaListResponseDto } from '../dtos/response/care-area.list.response.dto';
import { PaginationQuery } from '@/common/pagination/decorators/pagination.decorator';
import { PaginationService } from '@/common/pagination/services/pagination.service';
import {
  CareAreaSharedListDoc,
  CareAreaSharedParamsIdDoc,
  CareAreaSharedWithServiceChecklistDoc,
} from '../docs/care-area.shared.doc';
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
import { ENUM_PAGINATION_ORDER_DIRECTION_TYPE } from '@/common/pagination/enums/pagination.enum';
import { ENUM_VEHICLE_MODEL_TYPE } from '@/modules/vehicle-model/enums/vehicle-model.enum';
import { CareAreaGetResponseDto } from '../dtos/response/care-area.get.response.dto';
import { CareAreaWithServiceChecklistResponseDto } from '../dtos/response/care-area.with-service-checklist.response.dto';
import { CareAreaAdminParamsIdDoc } from '../docs/care-area.admin.doc';
import {
  CARE_AREA_DEFAULT_AVAILABLE_ORDER_BY,
  CARE_AREA_DEFAULT_AVAILABLE_SEARCH,
} from '../constants/care-area.list.constant';

@ApiTags('modules.shared.care-area')
@Controller({
  version: '1',
  path: '/care-area',
})
export class CareAreaSharedController {
  constructor(
    private readonly careAreaService: CareAreaService,
    private readonly paginationService: PaginationService,
  ) {}

  @CareAreaSharedListDoc()
  @ResponsePaging('care-area.list')
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
      availableSearch: CARE_AREA_DEFAULT_AVAILABLE_SEARCH,
      availableOrderBy: CARE_AREA_DEFAULT_AVAILABLE_ORDER_BY,
    })
    { _search, _limit, _offset, _order }: PaginationListDto,
  ): Promise<IResponsePaging<CareAreaListResponseDto>> {
    const find: Record<string, any> = {
      ..._search,
    };

    const careAreas = await this.careAreaService.findAll(find, {
      paging: {
        limit: _limit,
        offset: _offset,
      },
      order: _order,
    });

    const total: number = await this.careAreaService.getTotal(find);

    const totalPage: number = this.paginationService.totalPage(total, _limit);

    const mapped = this.careAreaService.mapList(careAreas);

    return {
      _pagination: {
        total,
        totalPage,
      },
      data: mapped,
    };
  }

  @CareAreaSharedParamsIdDoc()
  @Response('care-area.get')
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
  ): Promise<IResponse<CareAreaGetResponseDto>> {
    const careArea = await this.careAreaService.findOneById(id);
    if (!careArea) {
      throw new NotFoundException({
        message: 'care-area.error.notFound',
      });
    }
    const mapped = this.careAreaService.mapGet(careArea);
    return { data: mapped };
  }

  @CareAreaSharedWithServiceChecklistDoc()
  @ResponsePaging('care-area.listWithServiceChecklists')
  @PolicyRoleProtected(
    ENUM_POLICY_ROLE_TYPE.ADMIN,
    ENUM_POLICY_ROLE_TYPE.MANAGER,
    ENUM_POLICY_ROLE_TYPE.TECHNICIAN,
  )
  @UserProtected()
  @AuthJwtAccessProtected()
  @Get('/list/checklists')
  async listWithServiceChecklists(
    @PaginationQuery({
      availableSearch: CARE_AREA_DEFAULT_AVAILABLE_SEARCH,
      availableOrderBy: CARE_AREA_DEFAULT_AVAILABLE_ORDER_BY,
    })
    { _search, _limit, _offset, _order }: PaginationListDto,
    @Query('vehicleType') vehicleType?: ENUM_VEHICLE_MODEL_TYPE,
  ): Promise<IResponsePaging<CareAreaWithServiceChecklistResponseDto>> {
    const find: Record<string, any> = {
      ..._search,
    };

    const careAreasWithServiceChecklists =
      await this.careAreaService.findAllWithServiceChecklists(
        find,
        {
          paging: {
            limit: _limit,
            offset: _offset,
          },
          order: { order: ENUM_PAGINATION_ORDER_DIRECTION_TYPE.ASC },
        },
        vehicleType,
      );

    const total: number = await this.careAreaService.getTotal(find);

    const totalPage: number = this.paginationService.totalPage(total, _limit);

    return {
      _pagination: {
        total,
        totalPage,
      },
      data: careAreasWithServiceChecklists,
    };
  }
}
