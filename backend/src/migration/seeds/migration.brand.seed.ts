import { Injectable } from '@nestjs/common';
import { Command } from 'nestjs-command';
import { VehicleBrandService } from '@/modules/vehicle-brand/services/vehicle-brand.service';
import { MessageService } from '@/common/message/services/message.service';
import { ENUM_VEHICLE_BRAND_STATUS } from '@/modules/vehicle-brand/enums/vehicle-brand.enum';

@Injectable()
export class MigrationVehicleBrandSeed {
  constructor(
    private readonly vehicleBrandService: VehicleBrandService,
    private readonly messageService: MessageService,
  ) {}

  @Command({
    command: 'seed:vehicle-brand',
    describe: 'Seed initial vehicle brands',
  })
  async createMany(): Promise<void> {
    const vehicleBrands = [
      {
        name: 'Honda',
        slug: 'honda',
        description: 'Thương hiệu xe máy đến từ Nhật Bản',
        order: '1',
        country: 'Nhật Bản',
      },
      {
        name: 'Yamaha',
        slug: 'yamaha',
        description: 'Thương hiệu xe máy phổ biến tại Việt Nam',
        order: '2',
        country: 'Nhật Bản',
      },
      {
        name: 'Suzuki',
        slug: 'suzuki',
        description: 'Xe máy chất lượng đến từ Nhật Bản',
        order: '3',
        country: 'Nhật Bản',
      },
    ];

    for (const brand of vehicleBrands) {
      const exist = await this.vehicleBrandService.existBySlug(brand.slug);
      if (!exist) {
        await this.vehicleBrandService.create({
          ...brand,
          status: ENUM_VEHICLE_BRAND_STATUS.ACTIVE,
        });
      }
    }
  }

  async seeds(): Promise<void> {
    try {
      await this.createMany();
    } catch (err: any) {
      throw new Error(err.message || err);
    }
    return;
  }

  @Command({
    command: 'remove:vehicle-brand',
    describe: 'Remove all vehicle brands',
  })
  async remove(): Promise<void> {
    try {
      await this.vehicleBrandService.deleteMany();
    } catch (err: any) {
      throw new Error(err.message || err);
    }
    return;
  }
}
