import { applyDecorators } from '@nestjs/common';
import {
  Doc,
  DocAuth,
  DocRequest,
  DocResponse,
  DocResponsePaging,
} from '@/common/doc/decorators/doc.decorator';
import {
  ServiceCategoryDocParamsSlug,
  ServiceCategoryDocQueryStatus,
} from '../constants/service-category.doc.constant';
import { ServiceCategoryListResponseDto } from '../dtos/response/service-category.list.response.dto';
import { ServiceCategoryGetResponseDto } from '../dtos/response/service-category.get.response.dto';

export function ServiceCategoryPublicGetOneDoc(): MethodDecorator {
  return applyDecorators(
    Doc({
      summary: 'get one service category by slug',
    }),
    DocRequest({
      params: ServiceCategoryDocParamsSlug,
    }),
    DocAuth({
      jwtAccessToken: false,
    }),
    DocResponse<ServiceCategoryGetResponseDto>('service-category.get', {
      dto: ServiceCategoryGetResponseDto,
    }),
  );
}

export function ServiceCategoryPublicListDoc(): MethodDecorator {
  return applyDecorators(
    Doc({
      summary: 'get all service categories',
    }),
    DocRequest({
      queries: [...ServiceCategoryDocQueryStatus],
    }),
    DocAuth({
      jwtAccessToken: false,
    }),
    DocResponsePaging<ServiceCategoryListResponseDto>('service-category.list', {
      dto: ServiceCategoryListResponseDto,
    }),
  );
}
