export class CareAreaModel {
  id: string;
  name: string;
  description?: string;
  orderBy: string;

  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;

  createdBy?: string;
  updatedBy?: string;
  deletedBy?: string;
}
