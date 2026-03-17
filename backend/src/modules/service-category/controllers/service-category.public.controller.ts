import { Controller, Get, Param } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ServiceCategoryService } from '../services/service-category.services';
import {
  ServiceCategoryPublicListDoc,
  ServiceCategoryPublicGetOneDoc,
} from '../docs/service-category.public.doc';
import {
  IResponseReturn,
  IResponsePagingReturn,
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
  IPaginationQueryOffsetParams,
  IPaginationIn,
} from '@/common/pagination/interfaces/pagination.interface';
import { ServiceCategoryListResponseDto } from '../dtos/response/service-category.list.response.dto';
import {
  SERVICE_CATEGORY_DEFAULT_AVAILABLE_ORDER_BY,
  SERVICE_CATEGORY_DEFAULT_AVAILABLE_SEARCH,
  SERVICE_CATEGORY_DEFAULT_STATUS,
} from '../constants/service-category.list.constant';
import { RequestRequiredPipe } from '@/common/request/pipes/request.required.pipe';

@ApiTags('modules.public.service-category')
@Controller({
  version: '1',
  path: '/service-category',
})
export class ServiceCategoryPublicController {
  constructor(
    private readonly serviceCategoryService: ServiceCategoryService,
  ) {}

  @ServiceCategoryPublicGetOneDoc()
  @Response('service-category.get')
  @Get('/get/:slug')
  async get(
    @Param('slug', RequestRequiredPipe) slug: string,
  ): Promise<IResponseReturn<ServiceCategoryDto>> {
    return this.serviceCategoryService.findBySlug(slug);
  }

  @ServiceCategoryPublicListDoc()
  @ResponsePaging('service-category.list')
  @Get('/list')
  async list(
    @PaginationOffsetQuery({
      availableSearch: SERVICE_CATEGORY_DEFAULT_AVAILABLE_SEARCH,
      availableOrderBy: SERVICE_CATEGORY_DEFAULT_AVAILABLE_ORDER_BY,
    })
    pagination: IPaginationQueryOffsetParams,
    @PaginationQueryFilterInEnum('status', SERVICE_CATEGORY_DEFAULT_STATUS)
    status: Record<string, IPaginationIn>,
  ): Promise<IResponsePagingReturn<ServiceCategoryListResponseDto>> {
    return this.serviceCategoryService.getListOffset(pagination, status);
  }
}
