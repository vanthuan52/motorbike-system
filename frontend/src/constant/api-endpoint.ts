export const API_ENDPOINTS = {
  PUBLIC: {
    AUTH_LOGIN_CREDENTIAL: "auth/login/credential",
    AUTH_SIGN_UP: "auth/sign-up",
    AUTH_LOGOUT: "session/id/revoke",
    PART_TYPES: "part-type/list",
    PART_TYPE_DETAIL: (slug: string) => `part-type/get/${slug}`,
    HIRING: "hiring/list",
    HIRING_DETAILS: (slug: string) => `hiring/get/${slug}`,
    VEHICLE_BRAND_LIST: "vehicle-brand/list",
    VEHICLE_BRAND_DETAIL: (slug: string) => `vehicle-brand/get/${slug}`,
    VEHICLE_MODEL_LIST: "vehicle-model/list",
    VEHICLE_MODEL_DETAIL: (slug: string) => `vehicle-model/get/${slug}`,
    SERVICE_CATEGORY_LIST: "service-category/list",
    SERVICE_CATEGORY_DETAIL: (slug: string) => `service-category/get/${slug}`,
    CREATE_APPOINTMENT: "appointment/create",
  },
  SHARED: {
    USER_PROFILE: "user/profile",
    AUTH_REFRESH_TOKEN: "auth/refresh",
  },
};
