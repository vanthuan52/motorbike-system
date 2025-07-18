export const API_ENDPOINTS = {
  PUBLIC: {
    AUTH_LOGIN_CREDENTIAL: "auth/login/credential",
    AUTH_SIGN_UP: "auth/sign-up",
    AUTH_LOGOUT: "session/id/revoke",
  },
  SHARED: {
    USER_PROFILE: "user/profile",
    AUTH_REFRESH_TOKEN: "auth/refresh",
  },
  ADMIN: {
    // part-type module
    PART_TYPES: "part-type/list",
    PART_TYPE_DETAILS: (id: string) => `part-type/get/${id}`,
    PART_TYPE_CREATE: "part-type/create",
    PART_TYPE_UPDATE: (id: string) => `part-type/update/${id}`,
    PART_TYPE_DELETE: (id: string) => `part-type/delete/${id}`,
    PART_TYPE_UPDATE_STATUS: (id: string) => `part-type/update/${id}/status`,

    // hiring module
    HIRING: "hiring/list",
    HIRING_DETAILS: (id: string) => `hiring/get/${id}`,
    HIRING_CREATE: "hiring/create",
    HIRING_UPDATE: (id: string) => `hiring/update/${id}`,
    HIRING_DELETE: (id: string) => `hiring/delete/${id}`,
    HIRING_UPDATE_STATUS: (id: string) => `hiring/update/${id}/status`,

    // candidate module
    CANDIDATE_LIST: "hiring/candidate/list",
    CANDIDATE_DETAILS: (id: string) => `hiring/candidate/get/${id}`,
    CANDIDATE_UPDATE_STATUS: (id: string) =>
      `hiring/candidate/update/${id}/status`,
    CANDIDATE_REVIEW_LIST: `hiring/candidate-review/list`,
    CANDIDATE_REVIEW_CREATE: "hiring/candidate-review/create",

    // user module
    USER_LIST: "user/list",
    USER_LIST_TYPE_USER: "user/list/user",
    USER_DETAIL: (id: string) => `user/get/${id}`,
    USER_CREATE: "user/create",
    USER_UPDATE: (id: string) => `user/update/${id}`,
    USER_UPDATE_STATUS: (id: string) => `user/update/${id}/status`,
    USER_DELETION: (id: string) => `user/delete/${id}`,
    USER_TYPE_USER_CREATE: "user/create/user",

    // store module
    STORE_LIST: "store/list",
    STORE_DETAILS: (id: string) => `store/get/${id}`,
    STORE_CREATE: "store/create",
    STORE_UPDATE: (id: string) => `store/update/${id}`,
    STORE_DELETE: (id: string) => `store/delete/${id}`,
    STORE_UPDATE_STATUS: (id: string) => `store/update/${id}/status`,

    // service category module
    SERVICE_CATEGORY_LIST: "service-category/list",
    SERVICE_CATEGORY_DETAIL: (id: string) => `service-category/get/${id}`,
    SERVICE_CATEGORY_CREATE: "service-category/create",
    SERVICE_CATEGORY_UPDATE: (id: string) => `service-category/update/${id}`,
    SERVICE_CATEGORY_UPDATE_STATUS: (id: string) =>
      `service-category/update/${id}/status`,
    SERVICE_CATEGORY_DELETION: (id: string) => `service-category/delete/${id}`,

    // vehicle service module
    VEHICLE_SERVICE_LIST: "vehicle-service/list",
    VEHICLE_SERVICE_DETAIL: (id: string) => `vehicle-service/get/${id}`,
    VEHICLE_SERVICE_CREATE: "vehicle-service/create",
    VEHICLE_SERVICE_UPDATE: (id: string) => `vehicle-service/update/${id}`,
    VEHICLE_SERVICE_UPDATE_STATUS: (id: string) =>
      `vehicle-service/update/${id}/status`,
    VEHICLE_SERVICE_DELETION: (id: string) => `vehicle-service/delete/${id}`,

    // service checklist module
    SERVICE_CHECKLIST_LIST: "service-checklist/list",
    SERVICE_CHECKLIST_DETAIL: (id: string) => `service-checklist/get/${id}`,
    SERVICE_CHECKLIST_CREATE: "service-checklist/create",
    SERVICE_CHECKLIST_UPDATE: (id: string) => `service-checklist/update/${id}`,
    SERVICE_CHECKLIST_DELETION: (id: string) =>
      `service-checklist/delete/${id}`,

    // service price module
    SERVICE_PRICE_LIST: "service-price/list",
    SERVICE_PRICE_LIST_HISTORY: (
      vehicleServiceId: string,
      vehicleModelId: string
    ) => `service-price/list/history/${vehicleServiceId}/${{ vehicleModelId }}`,
    SERVICE_PRICE_DETAIL: (id: string) => `service-price/get/${id}`,
    SERVICE_PRICE_CREATE: "service-price/create",
    SERVICE_PRICE_UPDATE: (id: string) => `service-price/update/${id}`,
    SERVICE_PRICE_DELETION: (id: string) => `service-price/delete/${id}`,
    MODEL_SERVICE_PRICE_LIST: (id: string) =>
      `service-price/list/for-service/${id}`,
    SERVICE_PRICE_HISTORY_LIST: (
      vehicleServiceId: string,
      vehicleModelId: string
    ) => `service-price/list/history/${vehicleServiceId}/${vehicleModelId}`,

    // vehicle brand module
    VEHICLE_BRAND_LIST: "vehicle-brand/list",
    VEHICLE_BRAND_DETAIL: (id: string) => `vehicle-brand/get/${id}`,
    VEHICLE_BRAND_CREATE: "vehicle-brand/create",
    VEHICLE_BRAND_UPDATE: (id: string) => `vehicle-brand/update/${id}`,
    VEHICLE_BRAND_UPDATE_STATUS: (id: string) =>
      `vehicle-brand/update/${id}/status`,
    VEHICLE_BRAND_DELETION: (id: string) => `vehicle-brand/delete/${id}`,

    // vehicle model module
    VEHICLE_MODEL_LIST: "vehicle-model/list",
    VEHICLE_MODEL_DETAIL: (id: string) => `vehicle-model/get/${id}`,
    VEHICLE_MODEL_CREATE: "vehicle-model/create",
    VEHICLE_MODEL_UPDATE: (id: string) => `vehicle-model/update/${id}`,
    VEHICLE_MODEL_UPDATE_STATUS: (id: string) =>
      `vehicle-model/update/${id}/status`,
    VEHICLE_MODEL_DELETION: (id: string) => `vehicle-model/delete/${id}`,

    //vehicle parts module
    VEHICLE_PART_LIST: "part/list",
    VEHICLE_PART_DETAIL: (id: string) => `part/get/${id}`,
    VEHICLE_PART_CREATE: "part/create",
    VEHICLE_PART_UPDATE: (id: string) => `part/update/${id}`,
    VEHICLE_PART_UPDATE_STATUS: (id: string) => `part/update/${id}/status`,
    VEHICLE_PART_DELETION: (id: string) => `part/delete/${id}`,

    // maintenance schedule module
    APPOINTMENTS_LIST: "appointment/list",
    APPOINTMENTS_DETAIL: (id: string) => `appointment/get/${id}`,
    APPOINTMENTS_CREATE: "appointment/create",
    APPOINTMENTS_UPDATE: (id: string) => `appointment/update/${id}`,
    APPOINTMENTS_UPDATE_STATUS: (id: string) =>
      `appointment/update/${id}/status`,
    APPOINTMENTS_DELETION: (id: string) => `appointment/delete/${id}`,
    //maintenance user vehicle
    USER_VEHICLE_LIST: "user-vehicle/list",
    USER_VEHICLE_DETAIL: (id: string) => `user-vehicle/get/${id}`,
    USER_VEHICLE_CREATE: "user-vehicle/create",
    USER_VEHICLE_UPDATE: (id: string) => `user-vehicle/update/${id}`,
    USER_VEHICLE_DELETION: (id: string) => `user-vehicle/delete/${id}`,
    //care record
    CARE_RECORD_LIST: "care-record/list",
    CARE_RECORD_DETAIL: (id: string) => `care-record/get/${id}`,
    CARE_RECORD_CREATE: "care-record/create",
    CARE_RECORD_UPDATE: (id: string) => `care-record/update/${id}`,
    CARE_RECORD_UPDATE_STATUS: (id: string) =>
      `care-record/update/${id}/status`,
    CARE_RECORD_UPDATE_PAYMENT_STATUS: (id: string) =>
      `care-record/update/${id}/paymentStatus`,
    CARE_RECORD_ASSIGN_TECHNICIAN: (id: string) =>
      `care-record/update/${id}/technician`,
    CARE_RECORD_DELETION: (id: string) => `care-record/delete/${id}`,
    //care record checklist
    CARE_RECORD_CHECKLIST_LIST: "care-record-checklist/list",
    CARE_RECORD_CHECKLIST_DETAIL: (id: string) =>
      `care-record-checklist/get/${id}`,
    CARE_RECORD_CHECKLIST_CREATE: "care-record-checklist/create",
    CARE_RECORD_CHECKLIST_UPDATE: (id: string) =>
      `care-record-checklist/update/${id}`,
    CARE_RECORD_CHECKLIST_UPDATE_STATUS: (id: string) =>
      `care-record-checklist/update/${id}/status`,
    CARE_RECORD_CHECKLIST_DELETION: (id: string) =>
      `care-record-checklist/delete/${id}`,
  },
};
