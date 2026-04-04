/**
 * Domain model representing a care area (khu vực chăm sóc).
 * Maps from Prisma CareArea to application domain layer.
 */
export class CareAreaModel {
  id: string;
  name: string;
  description?: string;
  orderBy: number;

  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;

  createdBy?: string;
  updatedBy?: string;
  deletedBy?: string;

  constructor(data?: Partial<CareAreaModel>) {
    Object.assign(this, data);
  }

  isDeleted(): boolean {
    return !!this.deletedAt;
  }
}
