import { Controller, Get, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CareRecordService } from '../services/care-record.service';
import { CareRecordPublicListDoc } from '../docs/care-record.public.doc';
import { IResponsePaging } from '@/common/response/interfaces/response.interface';
import { ResponsePaging } from '@/common/response/decorators/response.decorator';
import { PaginationQuery } from '@/common/pagination/decorators/pagination.decorator';
import { PaginationListDto } from '@/common/pagination/dtos/pagination.list.dto';
import { CareRecordListResponseDto } from '../dtos/response/care-record.list.response.dto';
import { PaginationService } from '@/common/pagination/services/pagination.service';
import { SERVICE_PRICE_DEFAULT_AVAILABLE_ORDER_BY } from '../constants/care-record.list.constant';
import { OptionalParseUUIDPipe } from '@/app/pipes/optional-parse-uuid.pipe';

@ApiTags('module.public.care-record')
@Controller({
  version: '1',
  path: '/care-record',
})
export class CareRecordPublicController {
  constructor(
    private readonly CareRecordService: CareRecordService,
    private readonly paginationService: PaginationService,
  ) {}

  @CareRecordPublicListDoc()
  @ResponsePaging('care-record.list')
  @Get('/list')
  async list(
    @PaginationQuery({
      availableSearch: SERVICE_PRICE_DEFAULT_AVAILABLE_ORDER_BY,
      availableOrderBy: SERVICE_PRICE_DEFAULT_AVAILABLE_ORDER_BY,
    })
    { _search, _limit, _offset, _order }: PaginationListDto,
    @Query('vehicleService', OptionalParseUUIDPipe)
    vehicleServiceId: string,
    @Query('vehicleModel', OptionalParseUUIDPipe)
    vehicleModelId: string,
  ): Promise<IResponsePaging<CareRecordListResponseDto>> {
    const find: Record<string, any> = {
      ..._search,
    };

    if (vehicleServiceId) {
      find['vehicleService'] = vehicleServiceId;
    }

    if (vehicleModelId) {
      find['vehicleModel'] = vehicleModelId;
    }

    const CareRecords =
      await this.CareRecordService.findAllWithVehicleServiceAndVehicleModel(
        find,
        {
          paging: {
            limit: _limit,
            offset: _offset,
          },
          order: _order,
        },
      );

    const total: number =
      await this.CareRecordService.getTotalWithVehicleServiceAndVehicleModel(
        find,
      );

    const totalPage: number = this.paginationService.totalPage(total, _limit);

    const mapped = this.CareRecordService.mapList(CareRecords);
    return {
      _pagination: {
        total,
        totalPage,
      },
      data: mapped,
    };
  }
}
