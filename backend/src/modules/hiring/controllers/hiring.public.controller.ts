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
import { EnumHiringStatus, EnumHiringJobType } from '../enums/hiring.enum';
import { HiringUtil } from '../utils/hiring.util';
import { HiringResponseDto } from '../dtos/hiring-response.dto';
import { Prisma } from '@/generated/prisma-client';

@ApiTags('modules.hiring.public')
@Controller({
  version: '1',
  path: '/hiring',
})
export class HiringPublicController {
  constructor(
    private readonly hiringService: HiringService,
    private readonly hiringUtil: HiringUtil
  ) {}

  @HiringPublicParamsIdDoc()
  @Response('hiring.get')
  @HttpCode(HttpStatus.OK)
  @Get('/get/:slug')
  async get(
    @Param('slug') slug: string
  ): Promise<IResponseReturn<HiringResponseDto>> {
    const hiring = await this.hiringService.findOne({ slug });
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
    pagination: IPaginationQueryOffsetParams<
      Prisma.HiringSelect,
      Prisma.HiringWhereInput
    >,
    @PaginationQueryFilterInEnum('status', [
      EnumHiringStatus.published,
      EnumHiringStatus.draft,
      EnumHiringStatus.archived,
    ])
    status: Record<string, IPaginationIn>,
    @PaginationQueryFilterInEnum('jobType', [
      EnumHiringJobType.fullTime,
      EnumHiringJobType.partTime,
      EnumHiringJobType.contract,
      EnumHiringJobType.etc,
    ])
    jobType: Record<string, IPaginationIn>
  ): Promise<IResponsePagingReturn<HiringResponseDto>> {
    const filters: Record<string, any> = {
      ...status,
      ...jobType,
    };

    const result = await this.hiringService.getListOffset(pagination, filters);

    const mapped = this.hiringUtil.mapList(result.data);

    return {
      ...result,
      data: mapped,
    };
  }
}
