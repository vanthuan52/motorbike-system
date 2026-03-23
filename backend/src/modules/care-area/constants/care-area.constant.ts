import { CareAreaCreateRequestDto } from '../dtos/request/care-area.create.request.dto';
import { EnumCareArea } from '../enums/care-area.enum';

// Care Area constants with predefined UUIDs for seeding
export const CARE_AREA_IDS = {
  [EnumCareArea.lightElectricStarter]: '550e8400-e29b-41d4-a716-446655440001',
  [EnumCareArea.steeringSuspension]: '550e8400-e29b-41d4-a716-446655440002', 
  [EnumCareArea.brakeFrontRear]: '550e8400-e29b-41d4-a716-446655440003',
  [EnumCareArea.fuelIgnition]: '550e8400-e29b-41d4-a716-446655440004',
  [EnumCareArea.pot]: '550e8400-e29b-41d4-a716-446655440005',
  [EnumCareArea.pulyClutchShaft]: '550e8400-e29b-41d4-a716-446655440006',
  [EnumCareArea.oilEngineCoolingScooter]: '550e8400-e29b-41d4-a716-446655440007',
  [EnumCareArea.oilEngineCooling]: '550e8400-e29b-41d4-a716-446655440008',
  [EnumCareArea.steeringFrontWheel]: '550e8400-e29b-41d4-a716-446655440009',
  [EnumCareArea.transmissionRearWheel]: '550e8400-e29b-41d4-a716-44665544000a',
  [EnumCareArea.other]: '550e8400-e29b-41d4-a716-44665544000b',
};

export const CareAreaListWithIds: (CareAreaCreateRequestDto & { _id: string })[] = [
  {
    _id: CARE_AREA_IDS[EnumCareArea.lightElectricStarter],
    name: 'Bộ phận Đèn - Điện - Đề',
    description: 'Bộ phận Đèn - Điện - Đề',
    orderBy: '0',
  },
  {
    _id: CARE_AREA_IDS[EnumCareArea.steeringSuspension],
    name: 'Bộ phận Trục lái - Phuộc',
    description: 'Bộ phận Trục lái - Phuộc',
    orderBy: '1',
  },
  {
    _id: CARE_AREA_IDS[EnumCareArea.brakeFrontRear],
    name: 'Bộ phận Thắng trước sau',
    description: 'Bộ phận Thắng trước sau',
    orderBy: '2',
  },
  {
    _id: CARE_AREA_IDS[EnumCareArea.fuelIgnition],
    name: 'Bộ phận Xăng - Lửa',
    description: 'Bộ phận Xăng - Lửa',
    orderBy: '3',
  },
  {
    _id: CARE_AREA_IDS[EnumCareArea.pot],
    name: 'Bộ phận Nồi',
    description: 'Bộ phận Nồi',
    orderBy: '4',
  },
  {
    _id: CARE_AREA_IDS[EnumCareArea.pulyClutchShaft],
    name: 'Bộ phận Puly - Trục láp',
    description: 'Bộ phận Puly - Trục láp',
    orderBy: '5',
  },
  {
    _id: CARE_AREA_IDS[EnumCareArea.oilEngineCoolingScooter],
    name: 'Bộ phận Nhớt - Làm mát động cơ',
    description: 'Bộ phận Nhớt - Làm mát động cơ',
    orderBy: '6',
  },
  {
    _id: CARE_AREA_IDS[EnumCareArea.oilEngineCooling],
    name: 'Nhớt - Làm mát động cơ',
    description: 'Nhớt - Làm mát động cơ',
    orderBy: '7',
  },
  {
    _id: CARE_AREA_IDS[EnumCareArea.steeringFrontWheel],
    name: 'Trục lái - Bánh trước',
    description: 'Trục lái - Bánh trước',
    orderBy: '8',
  },
  {
    _id: CARE_AREA_IDS[EnumCareArea.transmissionRearWheel],
    name: 'Truyền tải - Bánh sau',
    description: 'Truyền tải - Bánh sau',
    orderBy: '9',
  },
  {
    _id: CARE_AREA_IDS[EnumCareArea.other],
    name: 'Bộ phận khác',
    description: 'Bộ phận khác',
    orderBy: '10',
  },
];
