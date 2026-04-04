import { faker } from '@faker-js/faker';
import { EnumVehicleServiceStatus } from '../enums/vehicle-service.enum';

interface DocField {
  name: string;
  allowEmptyValue: boolean;
  required: boolean;
  type: string;
  example: any;
  description?: string;
}

export const VehicleServiceDocParamsId: DocField[] = [
  {
    name: 'id',
    allowEmptyValue: false,
    required: true,
    type: 'string',
    example: faker.string.uuid(),
  },
];

export const VehicleServiceDocParamsSlug: DocField[] = [
  {
    name: 'slug',
    allowEmptyValue: false,
    required: true,
    type: 'string',
    example: faker.internet.url(),
  },
];

export const VehicleServiceDocQueryStatus: DocField[] = [
  {
    name: 'status',
    allowEmptyValue: true,
    required: false,
    type: 'string',
    example: Object.values(EnumVehicleServiceStatus).join(','),
    description: "value with ',' delimiter",
  },
];

export const VehicleServiceDocQueryOrderBy: DocField[] = [
  {
    name: 'orderBy',
    allowEmptyValue: true,
    required: false,
    type: 'string',
    example: 'order',
    description: 'Arrange the position sorting by order field',
  },
];

export const VehicleServiceDocQueryOrderDirection: DocField[] = [
  {
    name: 'orderDirection',
    allowEmptyValue: true,
    required: false,
    type: 'string',
    example: 'asc',
    description: 'Arrange the position sorting by order field',
  },
];

export const VehicleServiceDocQueryCategory: DocField[] = [
  {
    name: 'serviceCategory',
    allowEmptyValue: true,
    required: false,
    type: 'string',
    example: '',
    description: faker.string.uuid(),
  },
];
