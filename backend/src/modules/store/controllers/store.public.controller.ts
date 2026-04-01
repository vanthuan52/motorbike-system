import { Controller, Get, HttpCode, HttpStatus, Param } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { StoreService } from '../services/store.services';
import {
  StorePublicGetDoc,
  StorePublicListDoc,
} from '../docs/store.public.doc';
import {
  Response,
  ResponsePaging,
} from '@/common/response/decorators/response.decorator';
import { StoreDto } from '../dtos/store.dto';
import {
  IResponseReturn,
  IResponsePagingReturn,
} from '@/common/response/interfaces/response.interface';
import {
  PaginationQueryFilterInEnum,
  PaginationCursorQuery,
} from '@/common/pagination/decorators/pagination.decorator';
import {
  IPaginationQueryCursorParams,
  IPaginationIn,
} from '@/common/pagination/interfaces/pagination.interface';
import { EnumStoreStatus } from '../enums/store.enum';
import { StoreListResponseDto } from '../dtos/response/store.list.response.dto';
import { RequestRequiredPipe } from '@/common/request/pipes/request.required.pipe';
import { StoreUtil } from '../utils/store.util';
import { Prisma } from '@/generated/prisma-client';

@ApiTags('modules.public.store')
@Controller({
  version: '1',
  path: '/store',
})
export class StorePublicController {
  constructor(
    private readonly storeService: StoreService,
    private readonly storeUtil: StoreUtil
  ) {}

  @StorePublicGetDoc()
  @Response('store.get')
  @HttpCode(HttpStatus.OK)
  @Get('/get/:slug')
  async get(
    @Param('slug', RequestRequiredPipe) slug: string
  ): Promise<IResponseReturn<StoreDto>> {
    const store = await this.storeService.findOneBySlug(slug);
    const mapped = this.storeUtil.mapOne(store);
    return { data: mapped };
  }

  @StorePublicListDoc()
  @ResponsePaging('store.list')
  @HttpCode(HttpStatus.OK)
  @Get('/list')
  async list(
    @PaginationCursorQuery({
      availableSearch: ['name', 'status'],
    })
    pagination: IPaginationQueryCursorParams<
      Prisma.StoreSelect,
      Prisma.StoreWhereInput
    >,
    @PaginationQueryFilterInEnum('status', [
      EnumStoreStatus.active,
      EnumStoreStatus.inactive,
    ])
    status: Record<string, IPaginationIn>
  ): Promise<IResponsePagingReturn<StoreListResponseDto>> {
    const result = await this.storeService.getListCursor(pagination, status);
    const mapped = this.storeUtil.mapList(result.data);
    return {
      ...result,
      data: mapped,
    } as any;
  }
}
