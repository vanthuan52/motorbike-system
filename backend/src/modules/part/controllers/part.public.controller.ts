import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { PartService } from '../services/part.services';
import { PartUtil } from '../utils/part.util';
import {
  PartPublicListDoc,
  PartPublicGetOneDoc,
} from '../docs/part.public.doc';
import {
  IResponseReturn,
  IResponsePagingReturn,
} from '@/common/response/interfaces/response.interface';
import {
  Response,
  ResponsePaging,
} from '@/common/response/decorators/response.decorator';
import {
  PaginationCursorQuery,
  PaginationQueryFilterInEnum,
} from '@/common/pagination/decorators/pagination.decorator';
import {
  IPaginationIn,
  IPaginationQueryCursorParams,
} from '@/common/pagination/interfaces/pagination.interface';
import { PartListResponseDto } from '../dtos/response/part.list.response.dto';
import {
  PART_DEFAULT_AVAILABLE_ORDER_BY,
  PART_DEFAULT_AVAILABLE_SEARCH,
  PART_DEFAULT_STATUS,
} from '../constants/part.list.constant';
import { PartGetFullResponseDto } from '../dtos/response/part.full.response.dto';
import { RequestRequiredPipe } from '@/common/request/pipes/request.required.pipe';
import { PaginationUtil } from '@/common/pagination/utils/pagination.util';

@ApiTags('modules.public.part')
@Controller({
  version: '1',
  path: '/part',
})
export class PartPublicController {
  constructor(
    private readonly partService: PartService,
    private readonly partUtil: PartUtil,
    private readonly paginationUtil: PaginationUtil,
  ) {}

  @PartPublicGetOneDoc()
  @Response('part.get')
  @Get('/get/:slug')
  async get(
    @Param('slug', RequestRequiredPipe) slug: string,
  ): Promise<IResponseReturn<PartGetFullResponseDto>> {
    const part = await this.partService.findOneBySlug(slug);
    const mapped = this.partUtil.mapGetPopulate(part);
    return {
      data: mapped,
    };
  }

  @PartPublicListDoc()
  @ResponsePaging('part.list')
  @Get('/list')
  async list(
    @PaginationCursorQuery({
      availableSearch: PART_DEFAULT_AVAILABLE_SEARCH,
      availableOrderBy: PART_DEFAULT_AVAILABLE_ORDER_BY,
    })
    pagination: IPaginationQueryCursorParams,
    @PaginationQueryFilterInEnum('status', PART_DEFAULT_STATUS)
    status: Record<string, IPaginationIn>,
    @Query('partType') partTypeId: string,
    @Query('vehicleBrand') vehicleBrandId: string,
  ): Promise<IResponsePagingReturn<PartListResponseDto>> {
    const { data, total } = await this.partService.getListCursor(
      pagination,
      status,
      partTypeId,
      vehicleBrandId,
    );
    const mapped = this.partUtil.mapList(data);
    return this.paginationUtil.formatCursor(mapped, total, pagination);
  }
}
