import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Param,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { StoreService } from '../services/store.services';
import { PaginationService } from '@/common/pagination/services/pagination.service';
import { StoreUserGetDoc, StoreUserListDoc } from '../docs/store.public.doc';
import {
  Response,
  ResponsePaging,
} from '@/common/response/decorators/response.decorator';
import { StoreGetResponseDto } from '../dtos/response/store.get.response.dto';
import {
  IResponse,
  IResponsePaging,
} from '@/common/response/interfaces/response.interface';
import {
  PaginationQuery,
  PaginationQueryFilterInEnum,
} from '@/common/pagination/decorators/pagination.decorator';
import { StoreDoc } from '../entities/store.entity';
import { PaginationListDto } from '@/common/pagination/dtos/pagination.list.dto';
import { ENUM_STORE_STATUS } from '../enums/store.enum';
import { StoreListResponseDto } from '../dtos/response/store.list.response.dto';
import { MessageService } from '@/common/message/services/message.service';

@ApiTags('modules.store.public')
@Controller({
  version: '1',
  path: '/store',
})
export class StorePublicController {
  constructor(
    private readonly storeService: StoreService,
    private readonly paginationService: PaginationService,
    // private readonly messageService: MessageService,
  ) {}

  @StoreUserGetDoc()
  @Response('store.get')
  @HttpCode(HttpStatus.OK)
  @Get('/get/:slug')
  async get(
    @Param('slug') slug: string,
  ): Promise<IResponse<StoreGetResponseDto>> {
    const store = await this.storeService.findBySlug(slug);
    if (!store) {
      throw new NotFoundException({
        message: 'store.error.notFound',
      });
    }
    const mapped = this.storeService.mapGet(store);
    return { data: mapped };
  }

  @StoreUserListDoc()
  @ResponsePaging('store.list')
  @HttpCode(HttpStatus.OK)
  @Get('/list')
  async list(
    @PaginationQuery({
      availableSearch: ['name', 'status'],
    })
    { _search, _limit, _offset, _order }: PaginationListDto,
    @PaginationQueryFilterInEnum(
      'status',
      [ENUM_STORE_STATUS.ACTIVE, ENUM_STORE_STATUS.INACTIVE],
      ENUM_STORE_STATUS,
    )
    status: Record<string, any>,
  ): Promise<IResponsePaging<StoreListResponseDto>> {
    const find: Record<string, any> = {
      ..._search,
      ...status,
    };

    const store: StoreDoc[] = await this.storeService.findAll(find, {
      paging: {
        limit: _limit,
        offset: _offset,
      },
      order: _order,
    });

    const total: number = await this.storeService.getTotal(find);
    const totalPage: number = this.paginationService.totalPage(total, _limit);

    const mapped = this.storeService.mapList(store);

    return {
      _pagination: {
        total,
        totalPage,
      },
      data: mapped,
    };
  }
}
