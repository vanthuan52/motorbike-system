import { Controller, Get, Param } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ServiceCategoryService } from '../services/service-category.services';
import {
  ServiceCategoryPublicGetOneDoc,
  ServiceCategoryPublicListDoc,
} from '../docs/service-category.public.doc';
import {
  IResponsePagingReturn,
  IResponseReturn,
} from '@/common/response/interfaces/response.interface';
import { ServiceCategoryDto } from '../dtos/service-category.dto';
import {
  Response,
  ResponsePaging,
} from '@/common/response/decorators/response.decorator';
import {
  PaginationOffsetQuery,
  PaginationQueryFilterInEnum,
} from '@/common/pagination/decorators/pagination.decorator';
import {
  IPaginationIn,
  IPaginationQueryOffsetParams,
} from '@/common/pagination/interfaces/pagination.interface';
import { ServiceCategoryListResponseDto } from '../dtos/response/service-category.list.response.dto';
import {
  ServiceCategoryDefaultAvailableOrderBy,
  ServiceCategoryDefaultAvailableSearch,
  ServiceCategoryDefaultStatus,
} from '../constants/service-category.list.constant';
import { RequestRequiredPipe } from '@/common/request/pipes/request.required.pipe';
import { ServiceCategoryUtil } from '../utils/service-category.util';
import { Prisma } from '@/generated/prisma-client';

@ApiTags('modules.public.service-category')
@Controller({
  version: '1',
  path: '/service-category',
})
export class ServiceCategoryPublicController {
  constructor(
    private readonly serviceCategoryService: ServiceCategoryService,
    private readonly serviceCategoryUtil: ServiceCategoryUtil
  ) {}

  @ServiceCategoryPublicGetOneDoc()
  @Response('service-category.get')
  @Get('/get/:slug')
  async get(
    @Param('slug', RequestRequiredPipe) slug: string
  ): Promise<IResponseReturn<ServiceCategoryDto>> {
    const result = await this.serviceCategoryService.findBySlug(slug);
    const mapped = this.serviceCategoryUtil.mapGet(result);
    return {
      ...result,
      data: mapped,
    };
  }

  @ServiceCategoryPublicListDoc()
  @ResponsePaging('service-category.list')
  @Get('/list')
  async list(
    @PaginationOffsetQuery({
      availableSearch: ServiceCategoryDefaultAvailableSearch,
      availableOrderBy: ServiceCategoryDefaultAvailableOrderBy,
    })
    pagination: IPaginationQueryOffsetParams<
      Prisma.ServiceCategorySelect,
      Prisma.ServiceCategoryWhereInput
    >,
    @PaginationQueryFilterInEnum('status', ServiceCategoryDefaultStatus)
    status: Record<string, IPaginationIn>
  ): Promise<IResponsePagingReturn<ServiceCategoryListResponseDto>> {
    const result = await this.serviceCategoryService.getListOffset(pagination, {
      ...status,
    });
    const mapped = this.serviceCategoryUtil.mapList(result.data);
    return {
      ...result,
      data: mapped,
    };
  }
}
