import { HttpStatus, applyDecorators } from '@nestjs/common';

import { ServicePriceCreateRequestDto } from '../dtos/request/service-price.create.request.dto';
import { ServicePriceDto } from '../dtos/service-price.dto';
import {
  ModelServicePriceListResponseDto,
  ServicePriceListResponseDto,
} from '../dtos/response/service-price.list.response.dto';
import { ServicePriceUpdateRequestDto } from '../dtos/request/service-price.update.request.dto';
import {
  ServicePriceDocParamsId,
  ServicePriceDocParamsVehicleModelId,
  ServicePriceDocParamsVehicleServiceId,
  ServicePriceDocQueryOrderBy,
  ServicePriceDocQueryOrderDirection,
  ServicePriceDocQueryStatus,
  ServicePriceDocQueryVehicleModel,
  ServicePriceDocQueryVehicleService,
} from '../constants/service-price.doc.constant';
import {
  Doc,
  DocAuth,
  DocGuard,
  DocRequest,
  DocResponse,
  DocResponsePaging,
} from '@/common/doc/decorators/doc.decorator';
import { EnumDocRequestBodyType } from '@/common/doc/enums/doc.enum';
import { ServicePriceGetFullResponseDto } from '../dtos/response/service-price.full.response.dto';

export function ServicePriceAdminListDoc(): MethodDecorator {
  return applyDecorators(
    Doc({
      summary: 'get all service prices',
    }),
    DocRequest({
      queries: [
        ...ServicePriceDocQueryVehicleModel,
        ...ServicePriceDocQueryVehicleService,
        ...ServicePriceDocQueryStatus,
        ...ServicePriceDocQueryOrderBy,
        ...ServicePriceDocQueryOrderDirection,
      ],
    }),
    DocAuth({
      jwtAccessToken: true,
    }),
    DocGuard({ role: true, policy: true }),
    DocResponsePaging<ServicePriceListResponseDto>('service-price.list', {
      dto: ServicePriceListResponseDto,
    })
  );
}

export function ServicePriceAdminCreateDoc(): MethodDecorator {
  return applyDecorators(
    Doc({
      summary: 'create a new ServicePrice',
    }),
    DocRequest({
      bodyType: EnumDocRequestBodyType.json,
      dto: ServicePriceCreateRequestDto,
    }),
    DocAuth({
      jwtAccessToken: true,
    }),
    DocGuard({ role: true, policy: true }),
    DocResponse<ServicePriceDto>('service-price.create', {
      dto: ServicePriceDto,
      statusCode: HttpStatus.CREATED,
    })
  );
}

export function ServicePriceAdminUpdateDoc(): MethodDecorator {
  return applyDecorators(
    Doc({
      summary: 'update a service price',
    }),
    DocRequest({
      params: ServicePriceDocParamsId,
      bodyType: EnumDocRequestBodyType.json,
      dto: ServicePriceUpdateRequestDto,
    }),
    DocAuth({
      jwtAccessToken: true,
    }),
    DocGuard({ role: true, policy: true }),
    DocResponse('service-price.update')
  );
}

export function ServicePriceAdminDeleteDoc(): MethodDecorator {
  return applyDecorators(
    Doc({
      summary: 'delete a service price',
    }),
    DocRequest({
      params: ServicePriceDocParamsId,
    }),
    DocAuth({
      jwtAccessToken: true,
    }),
    DocGuard({ role: true, policy: true }),
    DocResponse('service-price.delete')
  );
}

export function ServicePriceAdminParamsIdDoc(): MethodDecorator {
  return applyDecorators(
    Doc({
      summary: 'get a service price by id',
    }),
    DocRequest({
      params: ServicePriceDocParamsId,
    }),
    DocAuth({
      jwtAccessToken: true,
    }),
    DocGuard({ role: true, policy: true }),
    DocResponse<ServicePriceDto>('service-price.getById', {
      dto: ServicePriceDto,
    })
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
    DocResponse<ServicePriceGetFullResponseDto>('service-price.get', {
      dto: ServicePriceGetFullResponseDto,
    })
  );
}

export function ServicePriceAdminListCombinedDoc(): MethodDecorator {
  return applyDecorators(
    Doc({
      summary: 'get all service prices with a set of services and models',
    }),
    DocRequest({
      queries: [
        ...ServicePriceDocQueryVehicleModel,
        ...ServicePriceDocQueryVehicleService,
        ...ServicePriceDocQueryOrderBy,
        ...ServicePriceDocQueryOrderDirection,
      ],
    }),
    DocAuth({
      jwtAccessToken: true,
    }),
    DocGuard({ role: true, policy: true }),
    DocResponsePaging<ModelServicePriceListResponseDto>(
      'service-price.listByService',
      {
        dto: ModelServicePriceListResponseDto,
      }
    )
  );
}

export function ServicePriceAdminListCombinedByServiceDoc(): MethodDecorator {
  return applyDecorators(
    Doc({
      summary: 'get all service prices with a set of service and models',
    }),
    DocRequest({
      params: ServicePriceDocParamsVehicleServiceId,
      queries: [
        ...ServicePriceDocQueryOrderBy,
        ...ServicePriceDocQueryOrderDirection,
      ],
    }),
    DocAuth({
      jwtAccessToken: true,
    }),
    DocGuard({ role: true, policy: true }),
    DocResponsePaging<ModelServicePriceListResponseDto>(
      'service-price.listByService',
      {
        dto: ModelServicePriceListResponseDto,
      }
    )
  );
}

export function ServicePriceAdminListHistoryDoc(): MethodDecorator {
  return applyDecorators(
    Doc({
      summary:
        'get all service prices history for a set of a service and a model ',
    }),
    DocRequest({
      params: [
        ...ServicePriceDocParamsVehicleServiceId,
        ...ServicePriceDocParamsVehicleModelId,
      ],
    }),
    DocAuth({
      jwtAccessToken: true,
    }),
    DocGuard({ role: true, policy: true }),
    DocResponsePaging<ServicePriceListResponseDto>(
      'service-price.listHistory',
      {
        dto: ServicePriceListResponseDto,
      }
    )
  );
}
