/**
 * Payload interface for migration seed — upsert a part type.
 * Intended for use in migration seeds only; does not require requestLog or createdBy.
 */
export interface IPartTypeMigrationUpsert {
  name: string;
  slug: string;
  description?: string;
}
