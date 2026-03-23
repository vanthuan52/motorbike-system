import { EnumCandidateStatus } from '../enums/hiring.enum';

export class CandidateModel {
  id: string;
  name: string;
  email: string;
  phone: string;
  appliedAt: Date;
  status: EnumCandidateStatus;
  resume?: string;
  hiringId: string;

  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;

  createdBy?: string;
  updatedBy?: string;
  deletedBy?: string;
}
