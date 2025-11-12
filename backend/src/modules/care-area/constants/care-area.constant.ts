import { CareAreaCreateRequestDto } from '../dtos/request/care-area.create.request.dto';
import { ENUM_CARE_AREA } from '../enums/care-area.enum';

// Care Area constants with predefined UUIDs for seeding
export const CARE_AREA_IDS = {
  [ENUM_CARE_AREA.LIGHT_ELECTRIC_STARTER]: '550e8400-e29b-41d4-a716-446655440001',
  [ENUM_CARE_AREA.STEERING_SUSPENSION]: '550e8400-e29b-41d4-a716-446655440002', 
  [ENUM_CARE_AREA.BRAKE_FRONT_REAR]: '550e8400-e29b-41d4-a716-446655440003',
  [ENUM_CARE_AREA.FUEL_IGNITION]: '550e8400-e29b-41d4-a716-446655440004',
  [ENUM_CARE_AREA.POT]: '550e8400-e29b-41d4-a716-446655440005',
  [ENUM_CARE_AREA.PULY_CLUTCH_SHAFT]: '550e8400-e29b-41d4-a716-446655440006',
  [ENUM_CARE_AREA.OIL_ENGINE_COOLING_SCOOTER]: '550e8400-e29b-41d4-a716-446655440007',
  [ENUM_CARE_AREA.OIL_ENGINE_COOLING]: '550e8400-e29b-41d4-a716-446655440008',
  [ENUM_CARE_AREA.STEERING_FRONT_WHEEL]: '550e8400-e29b-41d4-a716-446655440009',
  [ENUM_CARE_AREA.TRANSMISSION_REAR_WHEEL]: '550e8400-e29b-41d4-a716-44665544000a',
  [ENUM_CARE_AREA.OTHER]: '550e8400-e29b-41d4-a716-44665544000b',
};

export const CareAreaListWithIds: (CareAreaCreateRequestDto & { _id: string })[] = [
  {
    _id: CARE_AREA_IDS[ENUM_CARE_AREA.LIGHT_ELECTRIC_STARTER],
    name: 'Bộ phận Đèn - Điện - Đề',
    description: 'Bộ phận Đèn - Điện - Đề',
    order: '0',
  },
  {
    _id: CARE_AREA_IDS[ENUM_CARE_AREA.STEERING_SUSPENSION],
    name: 'Bộ phận Trục lái - Phuộc',
    description: 'Bộ phận Trục lái - Phuộc',
    order: '1',
  },
  {
    _id: CARE_AREA_IDS[ENUM_CARE_AREA.BRAKE_FRONT_REAR],
    name: 'Bộ phận Thắng trước sau',
    description: 'Bộ phận Thắng trước sau',
    order: '2',
  },
  {
    _id: CARE_AREA_IDS[ENUM_CARE_AREA.FUEL_IGNITION],
    name: 'Bộ phận Xăng - Lửa',
    description: 'Bộ phận Xăng - Lửa',
    order: '3',
  },
  {
    _id: CARE_AREA_IDS[ENUM_CARE_AREA.POT],
    name: 'Bộ phận Nồi',
    description: 'Bộ phận Nồi',
    order: '4',
  },
  {
    _id: CARE_AREA_IDS[ENUM_CARE_AREA.PULY_CLUTCH_SHAFT],
    name: 'Bộ phận Puly - Trục láp',
    description: 'Bộ phận Puly - Trục láp',
    order: '5',
  },
  {
    _id: CARE_AREA_IDS[ENUM_CARE_AREA.OIL_ENGINE_COOLING_SCOOTER],
    name: 'Bộ phận Nhớt - Làm mát động cơ',
    description: 'Bộ phận Nhớt - Làm mát động cơ',
    order: '6',
  },
  {
    _id: CARE_AREA_IDS[ENUM_CARE_AREA.OIL_ENGINE_COOLING],
    name: 'Nhớt - Làm mát động cơ',
    description: 'Nhớt - Làm mát động cơ',
    order: '7',
  },
  {
    _id: CARE_AREA_IDS[ENUM_CARE_AREA.STEERING_FRONT_WHEEL],
    name: 'Trục lái - Bánh trước',
    description: 'Trục lái - Bánh trước',
    order: '8',
  },
  {
    _id: CARE_AREA_IDS[ENUM_CARE_AREA.TRANSMISSION_REAR_WHEEL],
    name: 'Truyền tải - Bánh sau',
    description: 'Truyền tải - Bánh sau',
    order: '9',
  },
  {
    _id: CARE_AREA_IDS[ENUM_CARE_AREA.OTHER],
    name: 'Bộ phận khác',
    description: 'Bộ phận khác',
    order: '10',
  },
];
