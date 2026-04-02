import { HiringModel } from '../models/hiring.model';
import { EnumHiringJobType, EnumHiringStatus } from '../enums/hiring.enum';
import { CandidateMapper } from './candidate.mapper';

export class HiringMapper {
  static toDomain(prismaHiring: any): HiringModel {
    const model = new HiringModel();
    model.id = prismaHiring.id;
    model.title = prismaHiring.title;
    model.slug = prismaHiring.slug;
    model.description = prismaHiring.description;
    model.requirements = prismaHiring.requirements;
    model.location = prismaHiring.location;
    model.salaryRange = prismaHiring.salaryRange;
    model.applicationDeadline = prismaHiring.applicationDeadline;
    model.category = prismaHiring.category;
    const jobTypeMap: Record<string, EnumHiringJobType> = {
      FULL_TIME: EnumHiringJobType.fullTime,
      PART_TIME: EnumHiringJobType.partTime,
      CONTRACT: EnumHiringJobType.contract,
      ETC: EnumHiringJobType.etc,
    };
    model.jobType =
      jobTypeMap[prismaHiring.jobType] || EnumHiringJobType.fullTime;
    model.status = prismaHiring.status as EnumHiringStatus;

    model.createdAt = prismaHiring.createdAt;
    model.updatedAt = prismaHiring.updatedAt;
    model.deletedAt = prismaHiring.deletedAt;
    model.createdBy = prismaHiring.createdBy;
    model.updatedBy = prismaHiring.updatedBy;
    model.deletedBy = prismaHiring.deletedBy;

    if (prismaHiring.candidates && Array.isArray(prismaHiring.candidates)) {
      model.candidates = prismaHiring.candidates.map((c: any) =>
        CandidateMapper.toDomain(c)
      );
    }

    return model;
  }
}
