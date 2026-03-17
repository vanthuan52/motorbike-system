import { OmitType } from '@nestjs/swagger';
import { StoreDto } from '../store.dto';

export class StoreListResponseDto extends OmitType(StoreDto, [
  'createdAt',
  'updatedAt',
] as const) {}
