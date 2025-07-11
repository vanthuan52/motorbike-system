import { Injectable } from '@nestjs/common';
import { Command } from 'nestjs-command';
import { ServiceChecklistCreateRequestDto } from '@/modules/service-checklist/dtos/request/service-checklist.create.request.dto';
import { ENUM_SERVICE_CHECKLIST_AREA } from '@/modules/service-checklist/enums/service-checklist.enum';
import { ServiceChecklistService } from '@/modules/service-checklist/services/service-checklist.service';

@Injectable()
export class MigrationServiceChecklistSeed {
  constructor(
    private readonly serviceChecklistService: ServiceChecklistService,
  ) {}

  @Command({
    command: 'seed:service-checklist',
    describe: 'seed service checklist',
  })
  async seeds(): Promise<void> {
    const data: ServiceChecklistCreateRequestDto[] = [
      {
        code: 'check_throttle',
        name: 'Hoạt động tay ga',
        area: ENUM_SERVICE_CHECKLIST_AREA.ENGINE,
      },
      {
        code: 'check_clutch',
        name: 'Hoạt động tay côn (xe số)',
        area: ENUM_SERVICE_CHECKLIST_AREA.TRANSMISSION,
      },
      {
        code: 'check_front_shock',
        name: 'Giảm xóc trước',
        area: ENUM_SERVICE_CHECKLIST_AREA.SUSPENSION,
      },
      {
        code: 'check_rear_shock',
        name: 'Giảm xóc sau',
        area: ENUM_SERVICE_CHECKLIST_AREA.SUSPENSION,
      },
      {
        code: 'check_brake_system',
        name: 'Hệ thống phanh',
        area: ENUM_SERVICE_CHECKLIST_AREA.BRAKE,
      },
      {
        code: 'check_brake_lock',
        name: 'Hoạt động khóa phanh',
        area: ENUM_SERVICE_CHECKLIST_AREA.BRAKE,
      },
      {
        code: 'check_brake_pad_front',
        name: 'Mòn má phanh trước',
        area: ENUM_SERVICE_CHECKLIST_AREA.BRAKE,
      },
      {
        code: 'check_brake_pad_rear',
        name: 'Mòn má phanh sau',
        area: ENUM_SERVICE_CHECKLIST_AREA.BRAKE,
      },
      {
        code: 'check_front_tire',
        name: 'Bánh xe/lốp trước',
        area: ENUM_SERVICE_CHECKLIST_AREA.WHEEL,
      },
      {
        code: 'check_rear_tire',
        name: 'Bánh xe/lốp sau',
        area: ENUM_SERVICE_CHECKLIST_AREA.WHEEL,
      },
      {
        code: 'change_engine_oil',
        name: 'Thay dầu máy',
        area: ENUM_SERVICE_CHECKLIST_AREA.ENGINE,
      },
      {
        code: 'check_headlight',
        name: 'Đèn pha',
        area: ENUM_SERVICE_CHECKLIST_AREA.ELECTRIC,
      },
      {
        code: 'check_taillight',
        name: 'Đèn hậu',
        area: ENUM_SERVICE_CHECKLIST_AREA.ELECTRIC,
      },
      {
        code: 'check_kickstand',
        name: 'Chân chống nghiêng',
        area: ENUM_SERVICE_CHECKLIST_AREA.FRAME,
      },
      {
        code: 'check_center_stand',
        name: 'Chân chống giữa',
        area: ENUM_SERVICE_CHECKLIST_AREA.FRAME,
      },
      {
        code: 'check_spark_plug',
        name: 'Bugi',
        area: ENUM_SERVICE_CHECKLIST_AREA.FUEL,
      },
      {
        code: 'check_air_filter',
        name: 'Lọc gió',
        area: ENUM_SERVICE_CHECKLIST_AREA.FUEL,
      },
      {
        code: 'check_fi_system',
        name: 'Hệ thống xăng điện tử FI',
        area: ENUM_SERVICE_CHECKLIST_AREA.FUEL,
      },
      {
        code: 'clean_cooling_radiator',
        name: 'Súc két nước',
        area: ENUM_SERVICE_CHECKLIST_AREA.COOLING,
      },
      {
        code: 'check_battery',
        name: 'Ắc quy',
        area: ENUM_SERVICE_CHECKLIST_AREA.ELECTRIC,
      },
      {
        code: 'wash_full_body',
        name: 'Rửa toàn bộ xe',
        area: ENUM_SERVICE_CHECKLIST_AREA.BODY_CARE,
      },
    ];

    try {
      await this.serviceChecklistService.createMany(data);
    } catch (err: any) {
      throw new Error(err);
    }

    return;
  }

  @Command({
    command: 'remove:service-checklist',
    describe: 'remove service checklist',
  })
  async remove(): Promise<void> {
    try {
      await this.serviceChecklistService.deleteMany();
    } catch (err: any) {
      throw new Error(err);
    }

    return;
  }
}
