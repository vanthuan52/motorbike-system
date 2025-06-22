import { MaintenanceHistory } from "@/types/technician/MaintenanceHistory";
import { parts } from "./parts";

type PartValues = { [key: string]: number };
type PartNotes = { [key: string]: string };

export function buildMaintenanceHistory({
  values,
  notes,
  vehicleID,
  customerID,
  id,
  date,
  percentage_before_maintenance,
  percentage_after_maintenance,
}: {
  values: PartValues;
  notes: PartNotes;
  vehicleID: string;
  customerID: string;
  id: number;
  date: string;
  percentage_before_maintenance?: number;
  percentage_after_maintenance?: number;
}): MaintenanceHistory {
  return {
    id,
    customer_id: customerID,
    vehicle_id: vehicleID,
    details: {
      ...Object.fromEntries(
        parts.map((part) => [
          part.key,
          values[part.key] !== undefined
            ? { value: values[part.key], note: notes[part.key] || undefined }
            : undefined,
        ])
      ),
      percentage_before_maintenance: percentage_before_maintenance ?? null,
      percentage_after_maintenance: percentage_after_maintenance ?? null,
    },
    date,
  };
}