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
import { VehicleBrandDto } from '../dtos/vehicle-brand.dto';

export function VehicleBrandPublicGetOneDoc(): MethodDecorator {
  return applyDecorators(
    Doc({
      summary: 'get one vehicle brand by slug',
    }),
    DocRequest({
      params: VehicleBrandDocParamsSlug,
    }),
    DocResponse<VehicleBrandDto>('vehicle-brand.get', {
      dto: VehicleBrandDto,
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
