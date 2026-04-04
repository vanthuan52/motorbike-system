import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { UserVehicleRepository } from '../repository/user-vehicle.repository';
import { IUserVehicleService } from '../interfaces/user-vehicle.service.interface';
import { UserVehicleCreateRequestDto } from '../dtos/request/user-vehicle.create.request.dto';
import { UserVehicleUpdateRequestDto } from '../dtos/request/user-vehicle.update.request.dto';
import { UserVehicleUploadPhotoRequestDto } from '../dtos/request/user-vehicle.upload-photo.request.dto';
import { HelperService } from '@/common/helper/services/helper.service';
import { AwsS3Dto } from '@/common/aws/dtos/aws.s3.dto';
import {
  IPaginationQueryOffsetParams,
  IPaginationQueryCursorParams,
  IPaginationIn,
  IPaginationOffsetReturn,
  IPaginationCursorReturn,
} from '@/common/pagination/interfaces/pagination.interface';
import { EnumUserVehicleStatusCodeError } from '../enums/user-vehicle.status-code.enum';
import { VehicleModelRepository } from '@/modules/vehicle-model/repository/vehicle-model.repository';
import { UserVehicleModel } from '../models/user-vehicle.model';
import { UserService } from '@/modules/user/services/user.service';
import { Prisma } from '@/generated/prisma-client';
import { IRequestLog } from '@/common/request/interfaces/request.interface';

import { IUserVehicleListFilters } from '../interfaces/user-vehicle.filter.interface';

@Injectable()
export class UserVehicleService implements IUserVehicleService {
  private readonly uploadPath: string;

  constructor(
    private readonly userVehicleRepository: UserVehicleRepository,
    private readonly vehicleModelRepository: VehicleModelRepository,
    private readonly userService: UserService,
    private readonly configService: ConfigService,
    private readonly helperService: HelperService
  ) {
    this.uploadPath =
      this.configService.get<string>('userVehicle.uploadPath') || '';
  }

  async getListOffset(
    pagination: IPaginationQueryOffsetParams<
      Prisma.UserVehicleSelect,
      Prisma.UserVehicleWhereInput
    >,
    filters?: IUserVehicleListFilters
  ): Promise<IPaginationOffsetReturn<UserVehicleModel>> {
    return this.userVehicleRepository.findWithPaginationOffset(
      pagination,
      filters
    );
  }

  async getListCursor(
    pagination: IPaginationQueryCursorParams<
      Prisma.UserVehicleSelect,
      Prisma.UserVehicleWhereInput
    >,
    filters?: IUserVehicleListFilters
  ): Promise<IPaginationCursorReturn<UserVehicleModel>> {
    return this.userVehicleRepository.findWithPaginationCursor(
      pagination,
      filters
    );
  }

  async findOneById(id: string): Promise<UserVehicleModel> {
    const userVehicle = await this.userVehicleRepository.findOneById(id);
    if (!userVehicle) {
      throw new NotFoundException({
        statusCode: EnumUserVehicleStatusCodeError.notFound,
        message: 'user-vehicle.error.notFound',
      });
    }
    return userVehicle;
  }

  async findOne(
    find: Prisma.UserVehicleWhereInput
  ): Promise<UserVehicleModel | null> {
    return this.userVehicleRepository.findOne(find);
  }

  async create(
    payload: UserVehicleCreateRequestDto,
    requestLog: IRequestLog
  ): Promise<UserVehicleModel> {
    const [checkVehicleModel, checkUser] = await Promise.all([
      this.vehicleModelRepository.findOneById(payload.vehicleModel),
      this.userService.getOne(payload.user),
    ]);

    if (!checkVehicleModel) {
      throw new NotFoundException({
        statusCode: EnumUserVehicleStatusCodeError.notFound,
        message: 'vehicle-model.error.notFound',
      });
    }
    if (!checkUser) {
      throw new ConflictException({
        statusCode: EnumUserVehicleStatusCodeError.notFound,
        message: 'user.error.notFound',
      });
    }

    const created = await this.userVehicleRepository.create({
      user: { connect: { id: payload.user } },
      vehicleModel: { connect: { id: payload.vehicleModel } },
      modelYear: payload.modelYear,
      licensePlateNumber: payload.licensePlateNumber,
      engineNumber: payload.engineNumber,
      chassisNumber: payload.chassisNumber,
      color: payload.color,
    });

    return created;
  }

  async update(
    id: string,
    payload: UserVehicleUpdateRequestDto,
    requestLog: IRequestLog
  ): Promise<UserVehicleModel> {
    await this.findOneById(id);

    if (payload.vehicleModel) {
      const checkVehicleModel = await this.vehicleModelRepository.findOneById(
        payload.vehicleModel
      );
      if (!checkVehicleModel) {
        throw new NotFoundException({
          statusCode: EnumUserVehicleStatusCodeError.notFound,
          message: 'vehicle-model.error.notFound',
        });
      }
    }

    const updateData: Prisma.UserVehicleUpdateInput = {
      user: payload.user ? { connect: { id: payload.user } } : undefined,
      vehicleModel: payload.vehicleModel
        ? { connect: { id: payload.vehicleModel } }
        : undefined,
      modelYear: payload.modelYear ?? undefined,
      licensePlateNumber: payload.licensePlateNumber ?? undefined,
      engineNumber: payload.engineNumber ?? undefined,
      chassisNumber: payload.chassisNumber ?? undefined,
      color: payload.color ?? undefined,
    };

    const updated = await this.userVehicleRepository.update(id, updateData);
    return updated;
  }

  async delete(id: string, requestLog: IRequestLog): Promise<UserVehicleModel> {
    await this.findOneById(id);
    const deleted = await this.userVehicleRepository.update(id, {
      deletedAt: new Date(),
    });
    return deleted;
  }

  createRandomFilenamePhoto(
    userId: string,
    { mime }: UserVehicleUploadPhotoRequestDto
  ): string {
    let path: string = this.uploadPath.replace('{UserVehicle}', userId);
    const randomPath = this.helperService.randomString(10);
    const extension = mime.split('/')[1];

    if (path.startsWith('/')) {
      path = path.replace('/', '');
    }

    return `${path}/${randomPath}.${extension.toLowerCase()}`;
  }

  async updatePhoto(id: string, photo: AwsS3Dto): Promise<UserVehicleModel> {
    return this.userVehicleRepository.update(id, {
      photo: photo.completedUrl,
    });
  }
}
