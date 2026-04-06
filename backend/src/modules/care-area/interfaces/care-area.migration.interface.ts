/**
 * Payload interface for migration seed — create a care area item.
 * Intended for use in migration seeds only; does not require requestLog or actionBy.
 */
export interface ICareAreaMigrationCreate {
  name: string;
  description?: string;
  orderBy?: number;
}
