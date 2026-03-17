import { applyDecorators, HttpStatus } from '@nestjs/common';

import {
  ServiceCategoryDocParamsId,
  ServiceCategoryDocQueryOrderBy,
  ServiceCategoryDocQueryOrderDirection,
  ServiceCategoryDocQueryStatus,
} from '../constants/service-category.doc.constant';
import { ServiceCategoryDto } from '../dtos/service-category.dto';
import { ServiceCategoryListResponseDto } from '../dtos/response/service-category.list.response.dto';
import {
  Doc,
  DocAuth,
  DocGuard,
  DocRequest,
  DocResponse,
  DocResponsePaging,
} from '@/common/doc/decorators/doc.decorator';
import { EnumDocRequestBodyType } from '@/common/doc/enums/doc.enum';
import { ServiceCategoryCreateRequestDto } from '../dtos/request/service-category.create.request.dto';
import { ServiceCategoryUpdateRequestDto } from '../dtos/request/service-category.update.request.dto';
import { ServiceCategoryUpdateStatusRequestDto } from '../dtos/request/service-category.update-status.request.dto';

export function ServiceCategoryAdminListDoc(): MethodDecorator {
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
    DocAuth({
      jwtAccessToken: true,
    }),
    DocGuard({ role: true, policy: true }),
    DocResponsePaging<ServiceCategoryListResponseDto>('service-category.list', {
      dto: ServiceCategoryListResponseDto,
    }),
  );
}

export function ServiceCategoryAdminCreateDoc(): MethodDecorator {
  return applyDecorators(
    Doc({
      summary: 'create a new service category',
    }),
    DocRequest({
      bodyType: EnumDocRequestBodyType.json,
      dto: ServiceCategoryCreateRequestDto,
    }),
    DocAuth({
      jwtAccessToken: true,
    }),
    DocGuard({ role: true, policy: true }),
    DocResponse<ServiceCategoryDto>('service-category.create', {
      dto: ServiceCategoryDto,
      statusCode: HttpStatus.CREATED,
    }),
  );
}

export function ServiceCategoryAdminUpdateDoc(): MethodDecorator {
  return applyDecorators(
    Doc({
      summary: 'update a service category',
    }),
    DocRequest({
      params: ServiceCategoryDocParamsId,
      bodyType: EnumDocRequestBodyType.json,
      dto: ServiceCategoryUpdateRequestDto,
    }),
    DocAuth({
      jwtAccessToken: true,
    }),
    DocGuard({ role: true, policy: true }),
    DocResponse('service-category.update'),
  );
}

export function ServiceCategoryAdminDeleteDoc(): MethodDecorator {
  return applyDecorators(
    Doc({
      summary: 'delete a service category',
    }),
    DocRequest({
      params: ServiceCategoryDocParamsId,
    }),
    DocAuth({
      jwtAccessToken: true,
    }),
    DocGuard({ role: true, policy: true }),
    DocResponse('service-category.delete'),
  );
}

export function ServiceCategoryAdminUpdateStatusDoc(): MethodDecorator {
  return applyDecorators(
    Doc({
      summary: 'update status of a service category',
    }),
    DocRequest({
      params: ServiceCategoryDocParamsId,
      bodyType: EnumDocRequestBodyType.json,
      dto: ServiceCategoryUpdateStatusRequestDto,
    }),
    DocAuth({
      jwtAccessToken: true,
    }),
    DocGuard({ role: true, policy: true }),
    DocResponse('service-category.updateStatus'),
  );
}

export function ServiceCategoryAdminParamsIdDoc(): MethodDecorator {
  return applyDecorators(
    Doc({
      summary: 'get a service category by id',
    }),
    DocRequest({
      params: ServiceCategoryDocParamsId,
    }),
    DocAuth({
      jwtAccessToken: true,
    }),
    DocGuard({ role: true, policy: true }),
    DocResponse<ServiceCategoryDto>('service-category.getById', {
      dto: ServiceCategoryDto,
    }),
  );
}
