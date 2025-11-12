export enum ENUM_VEHICLE_MODEL_STATUS {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
}

export enum ENUM_VEHICLE_MODEL_TYPE {
  UNKNOWN = 'unknown', // Không xác định
  SCOOTER = 'scooter', // Xe tay ga
  MANUAL_OR_CLUTCH = 'manual_or_clutch', // Xe số/xe côn
  MANUAL = 'manual', // Xe số
  CLUTCH = 'clutch', // Xe côn
  ELECTRIC = 'electric', // Xe điện
}

export enum ENUM_VEHICLE_MODEL_FUEL_TYPE {
  UNKNOWN = 'unknown', // Không xác định
  GASOLINE = 'gasoline', // Xăng
  HYBRID = 'hybrid', // Hybrid
  ELECTRIC = 'electric', // Điện
}
