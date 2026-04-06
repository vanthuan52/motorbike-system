import { applyDecorators } from '@nestjs/common';
import {
  Doc,
  DocRequest,
  DocResponse,
  DocResponsePaging,
} from '@/common/doc/decorators/doc.decorator';
import {
  ServiceCategoryDocParamsSlug,
  ServiceCategoryDocQueryOrderBy,
  ServiceCategoryDocQueryOrderDirection,
  ServiceCategoryDocQueryStatus,
} from '../constants/service-category.doc.constant';
import { ServiceCategoryListResponseDto } from '../dtos/response/service-category.list.response.dto';
import { ServiceCategoryDto } from '../dtos/service-category.dto';

export function ServiceCategoryPublicGetOneDoc(): MethodDecorator {
  return applyDecorators(
    Doc({
      summary: 'get one service category by slug',
    }),
    DocRequest({
      params: ServiceCategoryDocParamsSlug,
    }),
    DocResponse<ServiceCategoryDto>('service-category.get', {
      dto: ServiceCategoryDto,
    })
  );
}

export function ServiceCategoryPublicListDoc(): MethodDecorator {
  return applyDecorators(
    Doc({
      summary: 'get all service categories',
    }),
    DocRequest({
      queries: [
        ...ServiceCategoryDocQueryStatus,
        ...ServiceCategoryDocQueryOrderBy,
        ...ServiceCategoryDocQueryOrderDirection,
      ],
    }),
    DocResponsePaging<ServiceCategoryListResponseDto>('service-category.list', {
      dto: ServiceCategoryListResponseDto,
    })
  );
}
