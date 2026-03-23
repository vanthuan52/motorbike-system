export class ServiceChecklistModel {
  id: string;
  name: string;
  code: string;
  description?: string;
  orderBy: string;
  vehicleType: string[];
  careAreaId: string;

  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;

  createdBy?: string;
  updatedBy?: string;
  deletedBy?: string;
}
