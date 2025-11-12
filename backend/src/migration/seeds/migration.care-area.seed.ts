import { Injectable } from '@nestjs/common';
import { Command } from 'nestjs-command';
import { CareAreaService } from '@/modules/care-area/services/care-area.service';
import { CareAreaListWithIds } from '@/modules/care-area/constants/care-area.constant';

@Injectable()
export class MigrationCareAreaSeed {
  constructor(private readonly careAreaService: CareAreaService) {}

  @Command({
    command: 'seed:care-area',
    describe: 'seed care area',
  })
  async seeds(): Promise<void> {
    try {
      await this.careAreaService.createMany(CareAreaListWithIds);
    } catch (err: any) {
      throw new Error(err);
    }

    return;
  }

  @Command({
    command: 'remove:care-area',
    describe: 'remove care area',
  })
  async remove(): Promise<void> {
    try {
      await this.careAreaService.deleteMany();
    } catch (err: any) {
      throw new Error(err);
    }

    return;
  }
}
