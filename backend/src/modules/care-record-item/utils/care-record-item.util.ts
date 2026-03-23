import { Injectable } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { CareRecordItem } from '@prisma/client';
import { CareRecordItemListResponseDto } from '../dtos/response/care-record-item.list.response.dto';
import { CareRecordItemDto } from '../dtos/care-record-item.dto';
import { CareRecordItemGetFullResponseDto } from '../dtos/response/care-record-item.full.response.dto';

@Injectable()
export class CareRecordItemUtil {
  mapList(careRecordItems: CareRecordItem[]): CareRecordItemListResponseDto[] {
    return plainToInstance(CareRecordItemListResponseDto, careRecordItems);
  }

  mapGet(careRecordItem: CareRecordItem): CareRecordItemDto {
    return plainToInstance(CareRecordItemDto, careRecordItem);
  }

  mapGetFull(careRecordItem: CareRecordItem): CareRecordItemGetFullResponseDto {
    return plainToInstance(CareRecordItemGetFullResponseDto, careRecordItem);
  }
}
