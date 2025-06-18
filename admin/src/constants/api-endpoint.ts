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
    CATEGORIES: "part-type/list",
    CATEGORY_DETAILS: (id: string) => `part-type/get/${id}`,
    CATEGORY_CREATE: "part-type/create",
    CATEGORY_UPDATE: (id: string) => `part-type/update/${id}`,
    CATEGORY_DELETE: (id: string) => `part-type/delete/${id}`,
    CATEGORY_UPDATE_STATUS: (id: string) => `part-type/update/${id}/status`,
    HIRING: "hiring/list",
    HIRING_DETAILS: (id: string) => `hiring/get/${id}`,
    HIRING_CREATE: "hiring/create",
    HIRING_UPDATE: (id: string) => `hiring/update/${id}`,
    HIRING_DELETE: (id: string) => `hiring/delete/${id}`,
    HIRING_UPDATE_STATUS: (id: string) => `hiring/update/${id}/status`,
  },
};
