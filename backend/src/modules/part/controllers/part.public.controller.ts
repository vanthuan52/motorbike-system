import {
  Controller,
  Get,
  NotFoundException,
  Param,
  Query,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { PartService } from '../services/part.services';
import {
  PartPublicListDoc,
  PartPublicGetOneDoc,
} from '../docs/part.public.doc';
import {
  IResponse,
  IResponsePaging,
} from '@/common/response/interfaces/response.interface';
import {
  Response,
  ResponsePaging,
} from '@/common/response/decorators/response.decorator';
import {
  PaginationQuery,
  PaginationQueryFilterInEnum,
} from '@/common/pagination/decorators/pagination.decorator';
import { PaginationListDto } from '@/common/pagination/dtos/pagination.list.dto';
import { PartListResponseDto } from '../dtos/response/part.list.response.dto';
import { PaginationService } from '@/common/pagination/services/pagination.service';
import {
  PART_DEFAULT_AVAILABLE_ORDER_BY,
  PART_DEFAULT_AVAILABLE_SEARCH,
  PART_DEFAULT_STATUS,
} from '../constants/part.list.constant';
import { ENUM_PART_STATUS } from '../enums/part.enum';
import { PartGetFullResponseDto } from '../dtos/response/part.full.response.dto';
import { PartDoc } from '../entities/part.entity';
import { OptionalParseUUIDPipe } from '@/app/pipes/optional-parse-uuid.pipe';

@ApiTags('modules.public.part')
@Controller({
  version: '1',
  path: '/part',
})
export class PartPublicController {
  constructor(
    private readonly partService: PartService,
    private readonly paginationService: PaginationService,
  ) {}

  @PartPublicGetOneDoc()
  @Response('part.get')
  @Get('/get/:slug')
  async get(
    @Param('slug') slug: string,
  ): Promise<IResponse<PartGetFullResponseDto>> {
    const part: PartDoc | null = await this.partService.findBySlug(slug);

    if (!part) {
      throw new NotFoundException({
        message: 'part.error.notFound',
      });
    }

    const partFull = await this.partService.join(part);

    const mapped: PartGetFullResponseDto =
      this.partService.mapGetPopulate(partFull);
    return { data: mapped };
  }

  @PartPublicListDoc()
  @ResponsePaging('part.list')
  @Get('/list')
  async list(
    @PaginationQuery({
      availableSearch: PART_DEFAULT_AVAILABLE_SEARCH,
      availableOrderBy: PART_DEFAULT_AVAILABLE_ORDER_BY,
    })
    { _search, _limit, _offset, _order }: PaginationListDto,
    @PaginationQueryFilterInEnum(
      'status',
      PART_DEFAULT_STATUS,
      ENUM_PART_STATUS,
    )
    status: Record<string, any>,
    @Query('partType', OptionalParseUUIDPipe)
    partTypeId: string,
    @Query('vehicleBrand', OptionalParseUUIDPipe)
    vehicleBrandId: string,
  ): Promise<IResponsePaging<PartListResponseDto>> {
    const find: Record<string, any> = {
      ..._search,
      ...status,
    };

    if (partTypeId) {
      find['partType'] = partTypeId;
    }

    if (vehicleBrandId) {
      find['vehicleBrand'] = vehicleBrandId;
    }

    const parts = await this.partService.findAllWithVehicleBrandAndPartType(
      find,
      {
        paging: {
          limit: _limit,
          offset: _offset,
        },
        order: _order,
      },
    );

    const total: number =
      await this.partService.getTotalWithVehicleBrandAndPartType(find);

    const totalPage: number = this.paginationService.totalPage(total, _limit);

    const mapped = this.partService.mapList(parts);
    return {
      _pagination: {
        total,
        totalPage,
      },
      data: mapped,
    };
  }
}
