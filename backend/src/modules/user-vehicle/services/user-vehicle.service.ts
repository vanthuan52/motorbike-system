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
} from '@/common/pagination/interfaces/pagination.interface';
import { EnumUserVehicleStatusCodeError } from '../enums/user-vehicle.status-code.enum';
import { VehicleModelRepository } from '@/modules/vehicle-model/repository/vehicle-model.repository';
import { UserRepository } from '@/modules/user/repository/user.repository';
import { UserVehicle, Prisma } from '@/generated/prisma-client';

@Injectable()
export class UserVehicleService implements IUserVehicleService {
  private readonly uploadPath: string;

  constructor(
    private readonly userVehicleRepository: UserVehicleRepository,
    private readonly vehicleModelRepository: VehicleModelRepository,
    private readonly userRepository: UserRepository,
    private readonly configService: ConfigService,
    private readonly helperService: HelperService,
  ) {
    this.uploadPath =
      this.configService.get<string>('userVehicle.uploadPath') || '';
  }

  async findAll(find?: Prisma.UserVehicleWhereInput): Promise<UserVehicle[]> {
    return this.userVehicleRepository.findAll({ where: find } as any);
  }

  async getListOffset(
    pagination: IPaginationQueryOffsetParams<
      Prisma.UserVehicleSelect,
      Prisma.UserVehicleWhereInput
    >,
    filters?: Record<string, IPaginationIn>,
  ): Promise<{ data: UserVehicle[]; total: number }> {
    const { data, count } =
      await this.userVehicleRepository.findWithPaginationOffset(
        pagination,
        filters,
      );

    return { data, total: count };
  }

  async getListCursor(
    pagination: IPaginationQueryCursorParams<
      Prisma.UserVehicleSelect,
      Prisma.UserVehicleWhereInput
    >,
    filters?: Record<string, IPaginationIn>,
  ): Promise<{ data: UserVehicle[]; total?: number }> {
    const { data, count } =
      await this.userVehicleRepository.findWithPaginationCursor(
        pagination,
        filters,
      );
    return { data, total: count };
  }

  async findAllWithVehicleModel(
    find?: Prisma.UserVehicleWhereInput,
  ): Promise<UserVehicle[]> {
    return this.userVehicleRepository.findAll({ where: find } as any);
  }

  async getTotalWithVehicleModel(
    find?: Prisma.UserVehicleWhereInput,
  ): Promise<number> {
    return this.userVehicleRepository.getTotal({ where: find } as any);
  }

  async findOneById(id: string): Promise<UserVehicle> {
    const userVehicle = await this.findOneByIdOrFail(id);
    return userVehicle;
  }

  async findOneWithVehicleModelById(id: string): Promise<UserVehicle | null> {
    return this.userVehicleRepository.findOneById(id);
  }

  async findOne(find: Prisma.UserVehicleWhereInput): Promise<UserVehicle> {
    const userVehicle = await this.userVehicleRepository.findOne(find);
    if (!userVehicle) {
      return null as any;
    }
    return userVehicle;
  }

  async getTotal(find?: Prisma.UserVehicleWhereInput): Promise<number> {
    return this.userVehicleRepository.getTotal({ where: find } as any);
  }

  async create(payload: UserVehicleCreateRequestDto): Promise<UserVehicle> {
    const [checkVehicleModel, checkUser] = await Promise.all([
      this.vehicleModelRepository.findOneById(payload.vehicleModel),
      this.userRepository.findOneById(payload.user),
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
      userId: payload.user,
      vehicleModelId: payload.vehicleModel,
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
  ): Promise<void> {
    await this.findOneByIdOrFail(id);

    if (payload.vehicleModel) {
      const checkVehicleModel = await this.vehicleModelRepository.findOneById(
        payload.vehicleModel,
      );
      if (!checkVehicleModel) {
        throw new NotFoundException({
          statusCode: EnumUserVehicleStatusCodeError.notFound,
          message: 'vehicle-model.error.notFound',
        });
      }
    }

    const updateData: Prisma.UserVehicleUpdateInput = {};
    if (payload.user) updateData.userId = payload.user;
    if (payload.vehicleModel) updateData.vehicleModelId = payload.vehicleModel;
    if (payload.modelYear !== undefined)
      updateData.modelYear = payload.modelYear;
    if (payload.licensePlateNumber !== undefined)
      updateData.licensePlateNumber = payload.licensePlateNumber;
    if (payload.engineNumber !== undefined)
      updateData.engineNumber = payload.engineNumber;
    if (payload.chassisNumber !== undefined)
      updateData.chassisNumber = payload.chassisNumber;
    if (payload.color !== undefined) updateData.color = payload.color;

    await this.userVehicleRepository.update(id, updateData);
  }

  async delete(id: string): Promise<boolean> {
    await this.findOneByIdOrFail(id);
    await this.userVehicleRepository.delete(id);
    return true;
  }

  async softDelete(repository: UserVehicle): Promise<UserVehicle> {
    return this.userVehicleRepository.update(repository.id, {
      deletedAt: new Date(),
    } as any);
  }

  async deleteMany(find?: Prisma.UserVehicleWhereInput): Promise<boolean> {
    await this.userVehicleRepository.deleteMany(find || {});
    return true;
  }

  createRandomFilenamePhoto(
    userId: string,
    { mime }: UserVehicleUploadPhotoRequestDto,
  ): string {
    let path: string = this.uploadPath.replace('{UserVehicle}', userId);
    const randomPath = this.helperService.randomString(10);
    const extension = mime.split('/')[1];

    if (path.startsWith('/')) {
      path = path.replace('/', '');
    }

    return `${path}/${randomPath}.${extension.toLowerCase()}`;
  }

  async updatePhoto(
    repository: UserVehicle,
    photo: AwsS3Dto,
  ): Promise<UserVehicle> {
    return this.userVehicleRepository.update(repository.id, {
      photo: {
        ...photo,
        size: photo.size,
      } as any,
    });
  }

  private async findOneByIdOrFail(id: string): Promise<UserVehicle> {
    const userVehicle = await this.userVehicleRepository.findOneById(id);
    if (!userVehicle) {
      throw new NotFoundException({
        statusCode: EnumUserVehicleStatusCodeError.notFound,
        message: 'user-vehicle.error.notFound',
      });
    }
    return userVehicle;
  }
}
