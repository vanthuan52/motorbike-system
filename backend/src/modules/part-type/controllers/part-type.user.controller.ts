import { Controller, Get, NotFoundException, Param } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { PartTypeService } from '../services/part-type.services';
import {
  PartTypeAdminGetDoc,
  PartTypeUserListDoc,
} from '../docs/part-type.user.doc';
import { PolicyRoleProtected } from '@/modules/policy/decorators/policy.decorator';
import { ENUM_POLICY_ROLE_TYPE } from '@/modules/policy/enums/policy.enum';
import { UserProtected } from '@/modules/user/decorators/user.decorator';
import { AuthJwtAccessProtected } from '@/modules/auth/decorators/auth.jwt.decorator';
import { ApiKeyProtected } from '@/modules/api-key/decorators/api-key.decorator';
import {
  IResponse,
  IResponsePaging,
} from '@/common/response/interfaces/response.interface';
import { PartTypeGetResponseDto } from '../dtos/response/part-type.get.response.dto';
import {
  Response,
  ResponsePaging,
} from '@/common/response/decorators/response.decorator';
import {
  PaginationQuery,
  PaginationQueryFilterInEnum,
} from '@/common/pagination/decorators/pagination.decorator';
import { PaginationListDto } from '@/common/pagination/dtos/pagination.list.dto';
import { ENUM_PART_TYPE_STATUS } from '../enums/part-type.enum';
import { PartTypeListResponseDto } from '../dtos/response/part-type.list.response.dto';
import { PaginationService } from '@/common/pagination/services/pagination.service';

@ApiTags('module.part-type.user')
@Controller({
  version: '1',
  path: '/part-type',
})
export class PartTypeUserController {
  constructor(
    private readonly partTypeService: PartTypeService,
    private readonly paginationService: PaginationService,
  ) {}

  @PartTypeAdminGetDoc()
  @Response('part-type.get')
  @PolicyRoleProtected(ENUM_POLICY_ROLE_TYPE.USER)
  @UserProtected([false])
  @AuthJwtAccessProtected()
  @Get('/get/:slug')
  async get(
    @Param('slug') slug: string,
  ): Promise<IResponse<PartTypeGetResponseDto>> {
    const partType = await this.partTypeService.findBySlug(slug);
    if (!partType) {
      throw new NotFoundException({
        message: 'part-type.error.notFound',
      });
    }
    const mapped = this.partTypeService.mapGet(partType);
    return { data: mapped };
  }
  
  @PartTypeUserListDoc()
  @ResponsePaging('part-type.list')
  @PolicyRoleProtected(ENUM_POLICY_ROLE_TYPE.USER)
  @UserProtected([false])
  @AuthJwtAccessProtected()
  @Get('/list')
  async list(
    @PaginationQuery({
      availableSearch: ['name', 'status'],
    })
    { _search, _limit, _offset, _order }: PaginationListDto,
    @PaginationQueryFilterInEnum(
      'status',
      [ENUM_PART_TYPE_STATUS.ACTIVE, ENUM_PART_TYPE_STATUS.INACTIVE],
      ENUM_PART_TYPE_STATUS,
    )
    status: Record<string, any>,
  ): Promise<IResponsePaging<PartTypeListResponseDto>> {
    const find: Record<string, any> = {
      ..._search,
      ...status,
    };

    const partTypes = await this.partTypeService.findAll(find, {
      paging: {
        limit: _limit,
        offset: _offset,
      },
      order: _order,
    });

    const total: number = await this.partTypeService.getTotal(find);

    const totalPage: number = this.paginationService.totalPage(total, _limit);

    const mapped = this.partTypeService.mapList(partTypes);
    return {
      _pagination: {
        total,
        totalPage,
      },
      data: mapped,
    };
  }
}
