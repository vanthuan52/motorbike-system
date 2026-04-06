/**
 * Payload interface for migration seed — upsert a vehicle brand.
 * Intended for use in migration seeds only; does not require requestLog or createdBy.
 */
export interface IVehicleBrandMigrationUpsert {
  name: string;
  slug: string;
  description?: string;
  country?: string;
  orderBy?: number;
}
