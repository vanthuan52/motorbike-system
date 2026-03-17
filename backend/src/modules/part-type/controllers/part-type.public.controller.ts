import { Controller, Get, Param } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { PartTypeService } from '../services/part-type.services';
import { PartTypeUtil } from '../utils/part-type.util';
import { PaginationUtil } from '@/common/pagination/utils/pagination.util';
import {
  PartTypePublicListDoc,
  PartTypePublicGetOneDoc,
} from '../docs/part-type.public.doc';
import {
  IResponseReturn,
  IResponsePagingReturn,
} from '@/common/response/interfaces/response.interface';
import { PartTypeDto } from '../dtos/part-type.dto';
import {
  Response,
  ResponsePaging,
} from '@/common/response/decorators/response.decorator';
import {
  PaginationOffsetQuery,
  PaginationQueryFilterInEnum,
} from '@/common/pagination/decorators/pagination.decorator';
import {
  IPaginationQueryOffsetParams,
  IPaginationIn,
} from '@/common/pagination/interfaces/pagination.interface';
import { PartTypeListResponseDto } from '../dtos/response/part-type.list.response.dto';
import {
  PART_TYPE_DEFAULT_AVAILABLE_ORDER_BY,
  PART_TYPE_DEFAULT_AVAILABLE_SEARCH,
  PART_TYPE_DEFAULT_STATUS,
} from '../constants/part-type.list.constant';
import { RequestRequiredPipe } from '@/common/request/pipes/request.required.pipe';

@ApiTags('modules.public.part-type')
@Controller({
  version: '1',
  path: '/part-type',
})
export class PartTypePublicController {
  constructor(
    private readonly partTypeService: PartTypeService,
    private readonly partTypeUtil: PartTypeUtil,
    private readonly paginationUtil: PaginationUtil,
  ) {}

  @PartTypePublicGetOneDoc()
  @Response('part-type.get')
  @Get('/get/:slug')
  async get(
    @Param('slug', RequestRequiredPipe) slug: string,
  ): Promise<IResponseReturn<PartTypeDto>> {
    const partType = await this.partTypeService.findOneBySlug(slug);
    const mapped = this.partTypeUtil.mapOne(partType);
    return { data: mapped };
  }

  @PartTypePublicListDoc()
  @ResponsePaging('part-type.list')
  @Get('/list')
  async list(
    @PaginationOffsetQuery({
      availableSearch: PART_TYPE_DEFAULT_AVAILABLE_SEARCH,
      availableOrderBy: PART_TYPE_DEFAULT_AVAILABLE_ORDER_BY,
    })
    pagination: IPaginationQueryOffsetParams,
    @PaginationQueryFilterInEnum('status', PART_TYPE_DEFAULT_STATUS)
    status: Record<string, IPaginationIn>,
  ): Promise<IResponsePagingReturn<PartTypeListResponseDto>> {
    const { data, total } = await this.partTypeService.getListOffset(
      pagination,
      status,
    );
    const mapped = this.partTypeUtil.mapList(data);
    return this.paginationUtil.formatOffset(mapped, total, pagination);
  }
}
