import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ServiceChecklistService } from '../services/service-checklist.service';
import { PaginationListDto } from '@/common/pagination/dtos/pagination.list.dto';
import { ResponsePaging } from '@/common/response/decorators/response.decorator';
import { IResponsePaging } from '@/common/response/interfaces/response.interface';
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

@ApiTags('modules.shared.service-checklist')
@Controller({
  version: '1',
  path: '/service-checklist',
})
export class ServiceChecklistSharedController {
  constructor(
    private readonly serviceChecklistService: ServiceChecklistService,
    private readonly paginationService: PaginationService,
  ) {}

  @ServiceChecklistSharedListDoc()
  @ResponsePaging('service-checklist.list')
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
      availableSearch: [],
      availableOrderBy: [],
    })
    { _search, _limit, _offset, _order }: PaginationListDto,
  ): Promise<IResponsePaging<ServiceChecklistListResponseDto>> {
    const find: Record<string, any> = {
      ..._search,
    };

    const ServiceChecklists = await this.serviceChecklistService.findAll(find, {
      paging: {
        limit: _limit,
        offset: _offset,
      },
      order: _order,
    });

    const total: number = await this.serviceChecklistService.getTotal(find);

    const totalPage: number = this.paginationService.totalPage(total, _limit);

    const mapped = this.serviceChecklistService.mapList(ServiceChecklists);

    return {
      _pagination: {
        total,
        totalPage,
      },
      data: mapped,
    };
  }
}
