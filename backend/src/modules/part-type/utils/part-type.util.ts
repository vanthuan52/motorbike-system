import { Injectable } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { Document } from 'mongoose';
import slugify from 'slugify';
import {
  IPartTypeDoc,
  IPartTypeEntity,
} from '../interfaces/part-type.interface';
import { PartTypeDoc } from '../entities/part-type.entity';
import { PartTypeListResponseDto } from '../dtos/response/part-type.list.response.dto';
import { PartTypeDto } from '../dtos/part-type.dto';

@Injectable()
export class PartTypeUtil {
  mapList(
    partTypes: IPartTypeDoc[] | IPartTypeEntity[] | PartTypeDoc[],
  ): PartTypeListResponseDto[] {
    return plainToInstance(
      PartTypeListResponseDto,
      partTypes.map((p: IPartTypeDoc | IPartTypeEntity | PartTypeDoc) =>
        p instanceof Document ? p.toObject() : p,
      ),
    );
  }

  mapOne(partType: IPartTypeDoc | IPartTypeEntity | PartTypeDoc): PartTypeDto {
    return plainToInstance(
      PartTypeDto,
      partType instanceof Document ? partType.toObject() : partType,
    );
  }

  createSlug(name: string): string {
    return slugify(name, {
      lower: true,
      strict: true,
      locale: 'vi',
    });
  }
}
