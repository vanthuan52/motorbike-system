import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { DatabaseDto } from '@/common/database/dtos/database.dto';
import { faker } from '@faker-js/faker';
import { EnumVehicleModelType } from '@/modules/vehicle-model/enums/vehicle-model.enum';

export class ServiceChecklistDto extends DatabaseDto {
  @ApiProperty({
    example: 'Checklist name',
    description: 'Tên checklist',
  })
  @Expose()
  name: string;

  @ApiPropertyOptional({
    example: 'CL001',
    description: 'Mã checklist',
  })
  @Expose()
  code?: string;

  @ApiPropertyOptional({
    example: 'Description',
    description: 'Mô tả',
  })
  @Expose()
  description?: string;

  @ApiPropertyOptional({
    example: 1,
    description: 'Thứ tự',
  })
  @Expose()
  orderBy?: number;

  @ApiPropertyOptional({
    example: faker.string.uuid(),
    description: 'ID khu vực',
  })
  @Expose()
  careArea?: string;

  @ApiPropertyOptional({
    description: 'Loại xe áp dụng',
    enum: EnumVehicleModelType,
    isArray: true,
  })
  @Expose()
  vehicleType?: EnumVehicleModelType[];
}
