import { applyDecorators } from '@nestjs/common';
import {
  Doc,
  DocRequest,
  DocResponse,
  DocResponsePaging,
} from '@/common/doc/decorators/doc.decorator';
import {
  VehicleBrandDocParamsSlug,
  VehicleBrandDocQueryOrderBy,
  VehicleBrandDocQueryOrderDirection,
  VehicleBrandDocQueryStatus,
} from '../constants/vehicle-brand.doc.constant';
import { VehicleBrandListResponseDto } from '../dtos/response/vehicle-brand.list.response.dto';
import { VehicleBrandGetResponseDto } from '../dtos/response/vehicle-brand.get.response.dto';

export function VehicleBrandPublicGetOneDoc(): MethodDecorator {
  return applyDecorators(
    Doc({
      summary: 'get one vehicle brand by slug',
    }),
    DocRequest({
      params: VehicleBrandDocParamsSlug,
    }),
    DocResponse<VehicleBrandGetResponseDto>('vehicle-brand.get', {
      dto: VehicleBrandGetResponseDto,
    }),
  );
}

export function VehicleBrandPublicListDoc(): MethodDecorator {
  return applyDecorators(
    Doc({
      summary: 'get all vehicle brands',
    }),
    DocRequest({
      queries: [
        ...VehicleBrandDocQueryStatus,
        ...VehicleBrandDocQueryOrderBy,
        ...VehicleBrandDocQueryOrderDirection,
      ],
    }),
    DocResponsePaging<VehicleBrandListResponseDto>('vehicle-brand.list', {
      dto: VehicleBrandListResponseDto,
    }),
  );
}
