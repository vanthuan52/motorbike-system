import { ApiTags } from '@nestjs/swagger';
import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Param,
} from '@nestjs/common';
import {
  Response,
  ResponsePaging,
} from '@/common/response/decorators/response.decorator';
import {
  IResponseReturn,
  IResponsePagingReturn,
} from '@/common/response/interfaces/response.interface';
import { HiringService } from '../services/hiring.service';
import {
  HiringPublicParamsIdDoc,
  HiringPublicListDoc,
} from '../docs/hiring.public.doc';
import {
  PaginationOffsetQuery,
  PaginationQueryFilterInEnum,
} from '@/common/pagination/decorators/pagination.decorator';
import {
  IPaginationQueryOffsetParams,
  IPaginationIn,
} from '@/common/pagination/interfaces/pagination.interface';
import { ENUM_HIRING_STATUS, ENUM_HIRING_TYPE } from '../enums/hiring.enum';
import { HiringDoc } from '../entities/hiring.entity';
import { PaginationService } from '@/common/pagination/services/pagination.service';
import { HiringUtil } from '../utils/hiring.util';
import { PaginationUtil } from '@/common/pagination/utils/pagination.util';
import { HiringResponseDto } from '../dtos/hiring-response.dto';

@ApiTags('modules.hiring.public')
@Controller({
  version: '1',
  path: '/hiring',
})
export class HiringPublicController {
  constructor(
    private readonly hiringService: HiringService,
    private readonly paginationService: PaginationService,
    private readonly hiringUtil: HiringUtil,
    private readonly paginationUtil: PaginationUtil,
  ) {}

  @HiringPublicParamsIdDoc()
  @Response('hiring.get')
  @HttpCode(HttpStatus.OK)
  @Get('/get/:slug')
  async get(
    @Param('slug') slug: string,
  ): Promise<IResponseReturn<HiringResponseDto>> {
    const hiring = await this.hiringService.findBySlug(slug);
    if (!hiring) {
      throw new NotFoundException({
        message: 'hiring.error.notFound',
      });
    }
    const mapped = this.hiringUtil.mapOne(hiring);
    return { data: mapped };
  }

  @HiringPublicListDoc()
  @ResponsePaging('hiring.list')
  @HttpCode(HttpStatus.OK)
  @Get('/list')
  async list(
    @PaginationOffsetQuery({
      availableSearch: ['title', 'status'],
    })
    { limit, skip, where, orderBy }: IPaginationQueryOffsetParams,
    @PaginationQueryFilterInEnum('status', [
      ENUM_HIRING_STATUS.PUBLISHED,
      ENUM_HIRING_STATUS.DRAFT,
      ENUM_HIRING_STATUS.ARCHIVED,
    ])
    status: Record<string, IPaginationIn>,
    @PaginationQueryFilterInEnum('jobType', [
      ENUM_HIRING_TYPE.FULL_TIME,
      ENUM_HIRING_TYPE.PART_TIME,
      ENUM_HIRING_TYPE.CONTRACT,
      ENUM_HIRING_TYPE.ETC,
    ])
    jobType: Record<string, IPaginationIn>,
  ): Promise<IResponsePagingReturn<HiringResponseDto>> {
    const find: Record<string, any> = {
      ...where,
      ...status,
      ...jobType,
    };

    const [hiring, total] = await Promise.all([
      this.hiringService.findAll(find, {
        paging: {
          limit,
          offset: skip,
        },
        order: orderBy,
      }),
      this.hiringService.getTotal(find),
    ]);

    const mapped = this.hiringUtil.mapList(hiring);

    return this.paginationUtil.formatOffset(mapped, total, {
      limit,
      skip,
    });
  }
}
