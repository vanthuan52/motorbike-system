import { applyDecorators } from '@nestjs/common';
import {
  Doc,
  DocRequest,
  DocResponse,
  DocResponsePaging,
} from '@/common/doc/decorators/doc.decorator';
import {
  VehicleModelDocParamsSlug,
  VehicleModelDocQueryEngineDisplacement,
  VehicleModelDocQueryFuelType,
  VehicleModelDocQueryModelYear,
  VehicleModelDocQueryOrderBy,
  VehicleModelDocQueryOrderDirection,
  VehicleModelDocQueryStatus,
  VehicleModelDocQueryType,
  VehicleModelDocQueryVehicleBrand,
} from '../constants/vehicle-model.doc.constant';
import { VehicleModelListResponseDto } from '../dtos/response/vehicle-model.list.response.dto';
import { VehicleModelGetFullResponseDto } from '../dtos/response/vehicle-model.full.response.dto';

export function VehicleModelPublicGetOneDoc(): MethodDecorator {
  return applyDecorators(
    Doc({
      summary: 'get one vehicle model by slug',
    }),
    DocRequest({
      params: VehicleModelDocParamsSlug,
    }),
    DocResponse<VehicleModelGetFullResponseDto>('vehicle-model.get', {
      dto: VehicleModelGetFullResponseDto,
    })
  );
}

export function VehicleModelPublicListDoc(): MethodDecorator {
  return applyDecorators(
    Doc({
      summary: 'get all vehicle models',
    }),
    DocRequest({
      queries: [
        ...VehicleModelDocQueryVehicleBrand,
        ...VehicleModelDocQueryStatus,
        ...VehicleModelDocQueryType,
        ...VehicleModelDocQueryFuelType,
        ...VehicleModelDocQueryOrderBy,
        ...VehicleModelDocQueryOrderDirection,
        ...VehicleModelDocQueryEngineDisplacement,
        ...VehicleModelDocQueryModelYear,
      ],
    }),
    DocResponsePaging<VehicleModelListResponseDto>('vehicle-model.list', {
      dto: VehicleModelListResponseDto,
    })
  );
}
