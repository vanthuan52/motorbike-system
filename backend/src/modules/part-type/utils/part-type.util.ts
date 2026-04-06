import { Injectable } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import slugify from 'slugify';
import { PartTypeListResponseDto } from '../dtos/response/part-type.list.response.dto';
import { PartTypeDto } from '../dtos/part-type.dto';
import { PartTypeModel } from '../models/part-type.model';

@Injectable()
export class PartTypeUtil {
  mapList(partTypes: PartTypeModel[]): PartTypeListResponseDto[] {
    return plainToInstance(PartTypeListResponseDto, partTypes, {
      excludeExtraneousValues: true,
    });
  }

  mapOne(partType: PartTypeModel): PartTypeDto {
    return plainToInstance(PartTypeDto, partType, {
      excludeExtraneousValues: true,
    });
  }

  mapActivityLogMetadata(partType: PartTypeModel): Record<string, any> {
    return {
      partTypeId: partType.id,
      name: partType.name,
      slug: partType.slug,
      status: partType.status,
    };
  }

  createSlug(name: string): string {
    return slugify(name, {
      lower: true,
      strict: true,
      locale: 'vi',
    });
  }
}
