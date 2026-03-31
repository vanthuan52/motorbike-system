/**
 * Domain model representing a service checklist template.
 * Maps from Prisma ServiceChecklist to application domain layer.
 */
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

  constructor(data?: Partial<ServiceChecklistModel>) {
    Object.assign(this, data);
  }

  isDeleted(): boolean {
    return !!this.deletedAt;
  }
}
