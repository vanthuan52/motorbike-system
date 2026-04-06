/**
 * Payload interface for migration seed — upsert a store.
 * Intended for use in migration seeds only; does not require requestLog or createdBy.
 */
export interface IStoreMigrationUpsert {
  name: string;
  slug: string;
  address: string;
  workHours: string;
  description?: string;
}
