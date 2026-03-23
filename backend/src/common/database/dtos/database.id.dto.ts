import { PickType } from '@nestjs/swagger';
import { DatabaseDto } from '@/common/database/dtos/database.dto';

export class DatabaseIdDto extends PickType(DatabaseDto, ['id'] as const) {}
