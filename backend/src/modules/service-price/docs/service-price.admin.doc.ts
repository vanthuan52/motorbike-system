import { applyDecorators, HttpStatus } from '@nestjs/common';

import { ServicePriceCreateRequestDto } from '../dtos/request/service-price.create.request.dto';
import { ServicePriceGetResponseDto } from '../dtos/response/service-price.get.response.dto';
import { ServicePriceListResponseDto } from '../dtos/response/service-price.list.response.dto';
import { ServicePriceUpdateRequestDto } from '../dtos/request/service-price.update.request.dto';
import {
  ServicePriceDocParamsId,
  ServicePriceDocQueryOrderBy,
  ServicePriceDocQueryOrderDirection,
  ServicePriceDocQueryServicePriceType,
  ServicePriceDocQueryStatus,
  ServicePriceDocQueryVehicleBrand,
} from '../constants/service-price.doc.constant';
import {
  Doc,
  DocAuth,
  DocGuard,
  DocRequest,
  DocResponse,
  DocResponsePaging,
} from '@/common/doc/decorators/doc.decorator';
import { ENUM_DOC_REQUEST_BODY_TYPE } from '@/common/doc/enums/doc.enum';
import { ServicePriceGetFullResponseDto } from '../dtos/response/service-price.full.response.dto';

export function ServicePriceAdminListDoc(): MethodDecorator {
  return applyDecorators(
    Doc({
      summary: 'get all ServicePrice',
    }),
    DocRequest({
      queries: [
        ...ServicePriceDocQueryVehicleBrand,
        ...ServicePriceDocQueryServicePriceType,
        ...ServicePriceDocQueryStatus,
        ...ServicePriceDocQueryOrderBy,
        ...ServicePriceDocQueryOrderDirection,
      ],
    }),
    DocAuth({
      jwtAccessToken: true,
    }),
    DocGuard({ role: true, policy: true }),
    DocResponsePaging<ServicePriceListResponseDto>('ServicePrice.list', {
      dto: ServicePriceListResponseDto,
    }),
  );
}

export function ServicePriceAdminCreateDoc(): MethodDecorator {
  return applyDecorators(
    Doc({
      summary: 'create a new ServicePrice',
    }),
    DocRequest({
      bodyType: ENUM_DOC_REQUEST_BODY_TYPE.JSON,
      dto: ServicePriceCreateRequestDto,
    }),
    DocAuth({
      jwtAccessToken: true,
    }),
    DocGuard({ role: true, policy: true }),
    DocResponse<ServicePriceGetResponseDto>('ServicePrice.create', {
      dto: ServicePriceGetResponseDto,
      statusCode: HttpStatus.CREATED,
    }),
  );
}

export function ServicePriceAdminUpdateDoc(): MethodDecorator {
  return applyDecorators(
    Doc({
      summary: 'update a ServicePrice',
    }),
    DocRequest({
      params: ServicePriceDocParamsId,
      bodyType: ENUM_DOC_REQUEST_BODY_TYPE.JSON,
      dto: ServicePriceUpdateRequestDto,
    }),
    DocAuth({
      jwtAccessToken: true,
    }),
    DocGuard({ role: true, policy: true }),
    DocResponse('ServicePrice.update'),
  );
}

export function ServicePriceAdminDeleteDoc(): MethodDecorator {
  return applyDecorators(
    Doc({
      summary: 'delete a ServicePrice',
    }),
    DocRequest({
      params: ServicePriceDocParamsId,
    }),
    DocAuth({
      jwtAccessToken: true,
    }),
    DocGuard({ role: true, policy: true }),
    DocResponse('ServicePrice.delete'),
  );
}

export function ServicePriceAdminParamsIdDoc(): MethodDecorator {
  return applyDecorators(
    Doc({
      summary: 'get a ServicePrice by id',
    }),
    DocRequest({
      params: ServicePriceDocParamsId,
    }),
    DocAuth({
      jwtAccessToken: true,
    }),
    DocGuard({ role: true, policy: true }),
    DocResponse<ServicePriceGetResponseDto>('ServicePrice.getById', {
      dto: ServicePriceGetResponseDto,
    }),
  );
}

export function ServicePriceAdminGetDoc(): MethodDecorator {
  return applyDecorators(
    Doc({
      summary: 'get detail a ServicePrice',
    }),
    DocRequest({
      params: ServicePriceDocParamsId,
    }),
    DocAuth({
      jwtAccessToken: true,
    }),
    DocGuard({ role: true, policy: true }),
    DocResponse<ServicePriceGetFullResponseDto>('ServicePrice.get', {
      dto: ServicePriceGetFullResponseDto,
    }),
  );
}
