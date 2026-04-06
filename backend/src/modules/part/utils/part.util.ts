import { Injectable } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import slugify from 'slugify';
import { PartListResponseDto } from '../dtos/response/part.list.response.dto';
import { PartDto } from '../dtos/part.dto';
import { PartGetFullResponseDto } from '../dtos/response/part.full.response.dto';
import { PartModel } from '../models/part.model';

@Injectable()
export class PartUtil {
  mapList(parts: PartModel[]): PartListResponseDto[] {
    return plainToInstance(PartListResponseDto, parts);
  }

  mapOne(part: PartModel): PartDto {
    return plainToInstance(PartDto, part);
  }

  mapGetPopulate(part: PartModel): PartGetFullResponseDto {
    return plainToInstance(PartGetFullResponseDto, part);
  }

  createSlug(name: string): string {
    return slugify(name, {
      lower: true,
      strict: true,
      locale: 'vi',
    });
  }
}
