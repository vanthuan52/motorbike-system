import { Injectable } from '@nestjs/common';
import { Command } from 'nestjs-command';
import { ServiceChecklistCreateRequestDto } from '@/modules/service-checklist/dtos/request/service-checklist.create.request.dto';
import { ServiceChecklistService } from '@/modules/service-checklist/services/service-checklist.service';
import { ServiceChecklistItem } from '@/modules/service-checklist/constants/service-checklist.constant';

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
    try {
      await this.serviceChecklistService.createMany(ServiceChecklistItem);
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
