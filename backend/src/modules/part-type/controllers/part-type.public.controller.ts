import { Controller, Get, NotFoundException, Param } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { PartTypeService } from '../services/part-type.services';
import {
  PartTypePublicListDoc,
  PartTypePublicGetOneDoc,
} from '../docs/part-type.public.doc';
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
import {
  VEHICLE_BRAND_DEFAULT_AVAILABLE_ORDER_BY,
  VEHICLE_BRAND_DEFAULT_AVAILABLE_SEARCH,
  VEHICLE_BRAND_DEFAULT_STATUS,
} from '@/modules/vehicle-brand/constants/vehicle-brand.list.constant';

@ApiTags('modules.public.part-type')
@Controller({
  version: '1',
  path: '/part-type',
})
export class PartTypePublicController {
  constructor(
    private readonly partTypeService: PartTypeService,
    private readonly paginationService: PaginationService,
  ) {}

  @PartTypePublicGetOneDoc()
  @Response('part-type.get')
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

  @PartTypePublicListDoc()
  @ResponsePaging('part-type.list')
  @Get('/list')
  async list(
    @PaginationQuery({
      availableSearch: VEHICLE_BRAND_DEFAULT_AVAILABLE_SEARCH,
      availableOrderBy: VEHICLE_BRAND_DEFAULT_AVAILABLE_ORDER_BY,
    })
    { _search, _limit, _offset, _order }: PaginationListDto,
    @PaginationQueryFilterInEnum(
      'status',
      VEHICLE_BRAND_DEFAULT_STATUS,
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
