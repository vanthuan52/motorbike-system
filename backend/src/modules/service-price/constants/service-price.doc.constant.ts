import { faker } from '@faker-js/faker';
import { ApiParamOptions } from '@nestjs/swagger';
import { ENUM_SERVICE_PRICE_STATUS } from '../enums/service-price.enum';

export const ServicePriceDocParamsId: ApiParamOptions[] = [
  {
    name: 'id',
    allowEmptyValue: false,
    required: true,
    type: 'string',
    example: faker.string.uuid(),
  },
];

export const ServicePriceDocParamsVehicleServiceId: ApiParamOptions[] = [
  {
    name: 'vehicleServiceId',
    allowEmptyValue: false,
    required: true,
    type: 'string',
    example: faker.string.uuid(),
  },
];

export const ServicePriceDocParamsVehicleModelId: ApiParamOptions[] = [
  {
    name: 'vehicleModelId',
    allowEmptyValue: false,
    required: true,
    type: 'string',
    example: faker.string.uuid(),
  },
];

export const ServicePriceDocQueryStatus: ApiParamOptions[] = [
  {
    name: 'status',
    allowEmptyValue: true,
    required: false,
    type: 'string',
    example: Object.values(ENUM_SERVICE_PRICE_STATUS).join(','),
    description: 'one value',
  },
];

export const ServicePriceDocQueryOrderBy: ApiParamOptions[] = [
  {
    name: 'orderBy',
    allowEmptyValue: true,
    required: false,
    type: 'string',
    example: 'order',
    description: 'Arrange the position sorting by order field',
  },
];

export const ServicePriceDocQueryOrderDirection: ApiParamOptions[] = [
  {
    name: 'orderDirection',
    allowEmptyValue: true,
    required: false,
    type: 'string',
    example: 'asc',
    description: 'Arrange the position sorting by order field',
  },
];

export const ServicePriceDocQueryVehicleModel: ApiParamOptions[] = [
  {
    name: 'vehicleModel',
    allowEmptyValue: true,
    required: false,
    type: 'string',
    example: '',
    description: faker.string.uuid(),
  },
];

export const ServicePriceDocQueryVehicleService: ApiParamOptions[] = [
  {
    name: 'vehicleService',
    allowEmptyValue: true,
    required: false,
    type: 'string',
    example: '',
    description: faker.string.uuid(),
  },
];

export const ServicePriceDocQueryVehicleModelId: ApiParamOptions[] = [
  {
    name: 'vehicleModelId',
    allowEmptyValue: true,
    required: false,
    type: 'string',
    example: '',
    description: faker.string.uuid(),
  },
];

export const ServicePriceDocQueryVehicleServiceId: ApiParamOptions[] = [
  {
    name: 'vehicleServiceId',
    allowEmptyValue: true,
    required: false,
    type: 'string',
    example: '',
    description: faker.string.uuid(),
  },
];
