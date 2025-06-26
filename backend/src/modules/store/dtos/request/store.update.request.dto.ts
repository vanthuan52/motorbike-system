import { PartialType } from '@nestjs/swagger';
import { StoreCreateRequestDto } from './store.create.request.dto';

export class StoreUpdateRequestDto extends PartialType(StoreCreateRequestDto) {}
