import { Injectable } from '@nestjs/common';
import { Command } from 'nestjs-command';
import { PartService } from '@/modules/part/services/part.services';
import { PartTypeService } from '@/modules/part-type/services/part-type.services';
import { VehicleBrandService } from '@/modules/vehicle-brand/services/vehicle-brand.service';
import { ENUM_PART_STATUS } from '@/modules/part/enums/part.enum';

@Injectable()
export class MigrationPartSeed {
  constructor(
    private readonly partService: PartService,
    private readonly partTypeService: PartTypeService,
    private readonly vehicleBrandService: VehicleBrandService,
  ) {}

  @Command({
    command: 'seed:part',
    describe: 'Seed initial parts',
  })
  async createMany(): Promise<void> {
    const partTypes = await this.partTypeService.findAll();
    const vehicleBrands = await this.vehicleBrandService.findAll();

    const parts = [
      {
        name: 'Lọc gió AirBlade 2024',
        slug: 'loc-gio-airblade-2024',
        description: 'Lọc gió dành cho dòng xe AirBlade 2024',
        partTypeName: 'Lọc gió',
        vehicleBrandName: 'Honda',
      },
      {
        name: 'Nhớt máy Yamaha Exciter',
        slug: 'nhot-may-yamaha-exciter',
        description: 'Dầu nhớt phù hợp cho Exciter',
        partTypeName: 'Nhớt máy',
        vehicleBrandName: 'Yamaha',
      },
      {
        name: 'Bugi NGK cho Suzuki',
        slug: 'bugi-ngk-cho-suzuki',
        description: 'Bugi chất lượng cao của NGK',
        partTypeName: 'Bugi',
        vehicleBrandName: 'Suzuki',
      },
    ];

    for (const part of parts) {
      const exist = await this.partService.existBySlug(part.slug);
      if (exist) continue;

      const partType = partTypes.find((pt) => pt.name === part.partTypeName);
      const vehicleBrand = vehicleBrands.find(
        (vb) => vb.name === part.vehicleBrandName,
      );

      if (!partType || !vehicleBrand) {
        console.warn(
          `❗ Skipping part "${part.name}" because partType or vehicleBrand not found`,
        );
        continue;
      }

      await this.partService.create({
        name: part.name,
        slug: part.slug,
        description: part.description,
        partType: partType._id,
        vehicleBrand: vehicleBrand._id,
        status: ENUM_PART_STATUS.ACTIVE,
      });
    }
  }

  @Command({
    command: 'remove:part',
    describe: 'Remove all parts',
  })
  async remove(): Promise<void> {
    try {
      await this.partService.deleteMany();
    } catch (err: any) {
      throw new Error(err.message || err);
    }
  }

  async seeds(): Promise<void> {
    try {
      await this.createMany();
    } catch (err: any) {
      throw new Error(err.message || err);
    }
  }
}
