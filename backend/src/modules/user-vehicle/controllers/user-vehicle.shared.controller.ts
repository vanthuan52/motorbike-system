import {
  Controller,
  Get,
  NotFoundException,
  Param,
  Query,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { UserVehicleService } from '../services/user-vehicle.service';
import {
  UserVehicleSharedListDoc,
  UserVehicleSharedGetDoc,
} from '../docs/user-vehicle.shared.doc';
import {
  IResponse,
  IResponsePaging,
} from '@/common/response/interfaces/response.interface';
import {
  Response,
  ResponsePaging,
} from '@/common/response/decorators/response.decorator';
import {
  PaginationQuery,
  PaginationQueryFilterInEnum,
} from '@/common/pagination/decorators/pagination.decorator';
import { PaginationListDto } from '@/common/pagination/dtos/pagination.list.dto';
import { UserVehicleListResponseDto } from '../dtos/response/user-vehicle.list.response.dto';
import { PaginationService } from '@/common/pagination/services/pagination.service';
import {
  USER_VEHICLE_DEFAULT_AVAILABLE_ORDER_BY,
  USER_VEHICLE_DEFAULT_AVAILABLE_SEARCH,
} from '../constants/user-vehicle.list.constant';
import { OptionalParseUUIDPipe } from '@/app/pipes/optional-parse-uuid.pipe';
import { UserVehicleDoc } from '../entities/user-vehicle.entity';
import { UserVehicleGetFullResponseDto } from '../dtos/response/user-vehicle.full.response.dto';

@ApiTags('module.shared.user-vehicle')
@Controller({
  version: '1',
  path: '/user-vehicle',
})
export class UserVehicleSharedController {
  constructor(
    private readonly userVehicleService: UserVehicleService,
    private readonly paginationService: PaginationService,
  ) {}

  @UserVehicleSharedListDoc()
  @ResponsePaging('user-vehicle.list')
  @Get('/list')
  async list(
    @PaginationQuery({
      availableSearch: USER_VEHICLE_DEFAULT_AVAILABLE_SEARCH,
      availableOrderBy: USER_VEHICLE_DEFAULT_AVAILABLE_ORDER_BY,
    })
    { _search, _limit, _offset, _order }: PaginationListDto,
    @Query('vehicleModel', OptionalParseUUIDPipe)
    vehicleModelId: string,
  ): Promise<IResponsePaging<UserVehicleListResponseDto>> {
    const find: Record<string, any> = {
      ..._search,
    };

    if (vehicleModelId) {
      find['vehicleModel._id'] = vehicleModelId;
    }

    const UserVehicles = await this.userVehicleService.findAllWithVehicleModel(
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
      await this.userVehicleService.getTotalWithVehicleModel(find);

    const totalPage: number = this.paginationService.totalPage(total, _limit);

    const mapped = this.userVehicleService.mapList(UserVehicles);
    return {
      _pagination: {
        total,
        totalPage,
      },
      data: mapped,
    };
  }
}
