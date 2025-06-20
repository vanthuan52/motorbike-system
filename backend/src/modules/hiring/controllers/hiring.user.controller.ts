import { Controller, Get, NotFoundException, Param } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { HiringService } from '../services/hiring.services';
import { HiringGetResponseDto } from '../dtos/response/hiring.get.response.dto';
import { PaginationService } from '@/common/pagination/services/pagination.service';
import { HiringUserGetDoc, HiringUserListDoc } from '../docs/hiring.user.doc';
import { PolicyRoleProtected } from '@/modules/policy/decorators/policy.decorator';
import { ENUM_POLICY_ROLE_TYPE } from '@/modules/policy/enums/policy.enum';
import { UserProtected } from '@/modules/user/decorators/user.decorator';
import { AuthJwtAccessProtected } from '@/modules/auth/decorators/auth.jwt.decorator';
import {
  Response,
  ResponsePaging,
} from '@/common/response/decorators/response.decorator';
import {
  IResponse,
  IResponsePaging,
} from '@/common/response/interfaces/response.interface';
import {
  PaginationQuery,
  PaginationQueryFilterInEnum,
} from '@/common/pagination/decorators/pagination.decorator';
import { PaginationListDto } from '@/common/pagination/dtos/pagination.list.dto';
import { ENUM_HIRING_STATUS } from '../enums/hiring.enum';
import { HiringListResponseDto } from '../dtos/response/hiring.list.response.dto';
import { HiringDoc } from '../entities/hiring.entity';

@ApiTags('modules.hiring.user')
@Controller({
  version: '1',
  path: '/hiring',
})
export class HiringUserController {
  constructor(
    private readonly hiringService: HiringService,
    private readonly paginationService: PaginationService,
  ) {}

  @HiringUserGetDoc()
  @Response('hiring.get')
  @PolicyRoleProtected(ENUM_POLICY_ROLE_TYPE.USER)
  @UserProtected([false])
  @AuthJwtAccessProtected()
  @Get('/get/:id')
  async get(@Param('id') id: string): Promise<IResponse<HiringGetResponseDto>> {
    const hiring = await this.hiringService.findOneById(id);
    if (!hiring) {
      throw new NotFoundException({
        message: 'hiring.error.notFound',
      });
    }
    const mapped = this.hiringService.mapGet(hiring);
    return { data: mapped };
  }

  @HiringUserListDoc()
  @ResponsePaging('hiring.list')
  @PolicyRoleProtected(ENUM_POLICY_ROLE_TYPE.USER)
  @UserProtected([false])
  @AuthJwtAccessProtected()
  @Get('/list')
  async list(
    @PaginationQuery({
      availableSearch: ['title', 'status'],
    })
    { _search, _limit, _offset, _order }: PaginationListDto,
    @PaginationQueryFilterInEnum(
      'status',
      [
        ENUM_HIRING_STATUS.PUBLISHED,
        ENUM_HIRING_STATUS.DRAFT,
        ENUM_HIRING_STATUS.ARCHIVED,
      ],
      ENUM_HIRING_STATUS,
    )
    status: Record<string, any>,
  ): Promise<IResponsePaging<HiringListResponseDto>> {
    const find: Record<string, any> = {
      ..._search,
      ...status,
    };

    const hiring: HiringDoc[] = await this.hiringService.findAll(find, {
      paging: {
        limit: _limit,
        offset: _offset,
      },
      order: _order,
    });

    const total: number = await this.hiringService.getTotal(find);
    const totalPage: number = this.paginationService.totalPage(total, _limit);

    const mapped = this.hiringService.mapList(hiring);

    return {
      _pagination: {
        total,
        totalPage,
      },
      data: mapped,
    };
  }
}
