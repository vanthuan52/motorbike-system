import { Injectable } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { Document } from 'mongoose';
import slugify from 'slugify';
import { IPartDoc, IPartEntity } from '../interfaces/part.interface';
import { PartDoc } from '../entities/part.entity';
import { PartListResponseDto } from '../dtos/response/part.list.response.dto';
import { PartDto } from '../dtos/part.dto';
import { PartGetFullResponseDto } from '../dtos/response/part.full.response.dto';

@Injectable()
export class PartUtil {
  mapList(
    parts: IPartDoc[] | IPartEntity[] | PartDoc[],
  ): PartListResponseDto[] {
    return plainToInstance(
      PartListResponseDto,
      parts.map((p: IPartDoc | IPartEntity | PartDoc) =>
        p instanceof Document ? p.toObject() : p,
      ),
    );
  }

  mapOne(part: IPartDoc | IPartEntity | PartDoc): PartDto {
    return plainToInstance(
      PartDto,
      part instanceof Document ? part.toObject() : part,
    );
  }

  mapGetPopulate(
    part: IPartDoc | IPartEntity | PartDoc,
  ): PartGetFullResponseDto {
    return plainToInstance(
      PartGetFullResponseDto,
      part instanceof Document ? part.toObject() : part,
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
