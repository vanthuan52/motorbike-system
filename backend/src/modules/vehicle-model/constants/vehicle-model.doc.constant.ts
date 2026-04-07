import { faker } from '@faker-js/faker';
import {
  EnumVehicleModelFuelType,
  EnumVehicleModelStatus,
  EnumVehicleModelType,
} from '../enums/vehicle-model.enum';

interface DocField {
  name: string;
  allowEmptyValue: boolean;
  required: boolean;
  type: string;
  example: any;
  description?: string;
}

export const VehicleModelDocParamsId: DocField[] = [
  {
    name: 'id',
    allowEmptyValue: false,
    required: true,
    type: 'string',
    example: faker.string.uuid(),
  },
];

export const VehicleModelDocParamsSlug: DocField[] = [
  {
    name: 'slug',
    allowEmptyValue: false,
    required: true,
    type: 'string',
    example: faker.internet.url(),
  },
];

export const VehicleModelDocQueryStatus: DocField[] = [
  {
    name: 'status',
    allowEmptyValue: true,
    required: false,
    type: 'string',
    example: Object.values(EnumVehicleModelStatus).join(','),
    description: "value with ',' delimiter",
  },
];

export const VehicleModelDocQueryType: DocField[] = [
  {
    name: 'type',
    allowEmptyValue: true,
    required: false,
    type: 'string',
    example: Object.values(EnumVehicleModelType).join(','),
    description: 'one value',
  },
];

export const VehicleModelDocQueryFuelType: DocField[] = [
  {
    name: 'fuelType',
    allowEmptyValue: true,
    required: false,
    type: 'string',
    example: Object.values(EnumVehicleModelFuelType).join(','),
    description: 'one value',
  },
];

export const VehicleModelDocQueryOrderBy: DocField[] = [
  {
    name: 'orderBy',
    allowEmptyValue: true,
    required: false,
    type: 'string',
    example: 'order',
    description: 'Arrange the position sorting by order field',
  },
];

export const VehicleModelDocQueryOrderDirection: DocField[] = [
  {
    name: 'orderDirection',
    allowEmptyValue: true,
    required: false,
    type: 'string',
    example: 'asc',
    description: 'Arrange the position sorting by order field',
  },
];

export const VehicleModelDocQueryVehicleBrand: DocField[] = [
  {
    name: 'vehicleBrand',
    allowEmptyValue: true,
    required: false,
    type: 'string',
    example: faker.string.uuid(),
    description: 'vehicle brand id',
  },
];

export const VehicleModelDocQueryEngineDisplacement: DocField[] = [
  {
    name: 'engineDisplacement',
    allowEmptyValue: true,
    required: false,
    type: 'string',
    example: '125',
    description: 'Engine Displacement',
  },
];

export const VehicleModelDocQueryModelYear: DocField[] = [
  {
    name: 'modelYear',
    allowEmptyValue: true,
    required: false,
    type: 'string',
    example: '2025',
    description: 'Model year',
  },
];
