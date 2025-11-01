import { faker } from '@faker-js/faker';
import { ENUM_APPOINTMENT_STATUS } from '../enums/appointment.enum';

interface DocField {
  name: string;
  allowEmptyValue: boolean;
  required: boolean;
  type: string;
  example: any;
  description?: string;
}

export const AppointmentDocParamsId: DocField[] = [
  {
    name: 'id',
    allowEmptyValue: false,
    required: true,
    type: 'string',
    example: faker.string.uuid(),
  },
];

export const AppointmentDocQueryStatus: DocField[] = [
  {
    name: 'status',
    allowEmptyValue: true,
    required: false,
    type: 'string',
    example: Object.values(ENUM_APPOINTMENT_STATUS).join(','),
    description: "value with ',' delimiter",
  },
];

export const AppointmentDocQueryOrderBy: DocField[] = [
  {
    name: 'orderBy',
    allowEmptyValue: true,
    required: false,
    type: 'string',
    example: 'order',
    description: 'Arrange the position sorting by order field',
  },
];

export const AppointmentDocQueryOrderDirection: DocField[] = [
  {
    name: 'orderDirection',
    allowEmptyValue: true,
    required: false,
    type: 'string',
    example: 'asc',
    description: 'Arrange the position sorting by order field',
  },
];

export const AppointmentDocQueryVehicleService: DocField[] = [
  {
    name: 'vehicleService',
    allowEmptyValue: true,
    required: false,
    type: 'string',
    example: '',
    description: faker.string.uuid(),
  },
];
