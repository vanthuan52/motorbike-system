import { Controller, Get, NotFoundException, Param } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ServiceCategoryService } from '../services/service-category.services';
import {
  ServiceCategoryPublicListDoc,
  ServiceCategoryPublicGetOneDoc,
} from '../docs/service-category.public.doc';
import {
  IResponse,
  IResponsePaging,
} from '@/common/response/interfaces/response.interface';
import { ServiceCategoryGetResponseDto } from '../dtos/response/service-category.get.response.dto';
import {
  Response,
  ResponsePaging,
} from '@/common/response/decorators/response.decorator';
import {
  PaginationQuery,
  PaginationQueryFilterInEnum,
} from '@/common/pagination/decorators/pagination.decorator';
import { PaginationListDto } from '@/common/pagination/dtos/pagination.list.dto';
import { ENUM_SERVICE_CATEGORY_STATUS } from '../enums/service-category.enum';
import { ServiceCategoryListResponseDto } from '../dtos/response/service-category.list.response.dto';
import { PaginationService } from '@/common/pagination/services/pagination.service';
import {
  SERVICE_CATEGORY_DEFAULT_AVAILABLE_ORDER_BY,
  SERVICE_CATEGORY_DEFAULT_AVAILABLE_SEARCH,
  SERVICE_CATEGORY_DEFAULT_STATUS,
} from '../constants/service-category.list.constant';

@ApiTags('modules.public.service-category')
@Controller({
  version: '1',
  path: '/service-category',
})
export class ServiceCategoryPublicController {
  constructor(
    private readonly serviceCategoryService: ServiceCategoryService,
    private readonly paginationService: PaginationService,
  ) {}

  @ServiceCategoryPublicGetOneDoc()
  @Response('service-category.get')
  @Get('/get/:slug')
  async get(
    @Param('slug') slug: string,
  ): Promise<IResponse<ServiceCategoryGetResponseDto>> {
    const ServiceCategory = await this.serviceCategoryService.findBySlug(slug);
    if (!ServiceCategory) {
      throw new NotFoundException({
        message: 'service-category.error.notFound',
      });
    }
    const mapped = this.serviceCategoryService.mapGet(ServiceCategory);
    return { data: mapped };
  }

  @ServiceCategoryPublicListDoc()
  @ResponsePaging('service-category.list')
  @Get('/list')
  async list(
    @PaginationQuery({
      availableSearch: SERVICE_CATEGORY_DEFAULT_AVAILABLE_SEARCH,
      availableOrderBy: SERVICE_CATEGORY_DEFAULT_AVAILABLE_ORDER_BY,
    })
    { _search, _limit, _offset, _order }: PaginationListDto,
    @PaginationQueryFilterInEnum(
      'status',
      SERVICE_CATEGORY_DEFAULT_STATUS,
      ENUM_SERVICE_CATEGORY_STATUS,
    )
    status: Record<string, any>,
  ): Promise<IResponsePaging<ServiceCategoryListResponseDto>> {
    const find: Record<string, any> = {
      ..._search,
      ...status,
    };

    const ServiceCategorys = await this.serviceCategoryService.findAll(find, {
      paging: {
        limit: _limit,
        offset: _offset,
      },
      order: _order,
    });

    const total: number = await this.serviceCategoryService.getTotal(find);

    const totalPage: number = this.paginationService.totalPage(total, _limit);

    const mapped = this.serviceCategoryService.mapList(ServiceCategorys);
    return {
      _pagination: {
        total,
        totalPage,
      },
      data: mapped,
    };
  }
}
