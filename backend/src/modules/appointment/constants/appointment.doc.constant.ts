import { faker } from '@faker-js/faker';
import { ENUM_APPOINTMENT_STATUS } from '../enums/appointment.enum';
import { ApiParamOptions } from '@nestjs/swagger';

export const AppointmentDocParamsId: ApiParamOptions[] = [
  {
    name: 'id',
    allowEmptyValue: false,
    required: true,
    type: 'string',
    example: faker.string.uuid(),
  },
];

export const AppointmentDocQueryStatus: ApiParamOptions[] = [
  {
    name: 'status',
    allowEmptyValue: true,
    required: false,
    type: 'string',
    example: Object.values(ENUM_APPOINTMENT_STATUS).join(','),
    description: "value with ',' delimiter",
  },
];

export const AppointmentDocQueryOrderBy: ApiParamOptions[] = [
  {
    name: 'orderBy',
    allowEmptyValue: true,
    required: false,
    type: 'string',
    example: 'order',
    description: 'Arrange the position sorting by order field',
  },
];

export const AppointmentDocQueryOrderDirection: ApiParamOptions[] = [
  {
    name: 'orderDirection',
    allowEmptyValue: true,
    required: false,
    type: 'string',
    example: 'asc',
    description: 'Arrange the position sorting by order field',
  },
];

export const AppointmentDocQueryVehicleService: ApiParamOptions[] = [
  {
    name: 'vehicleService',
    allowEmptyValue: true,
    required: false,
    type: 'string',
    example: '',
    description: faker.string.uuid(),
  },
];
