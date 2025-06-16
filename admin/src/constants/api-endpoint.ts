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
  ADMIN:{
    CATEGORIES: "part-type/list",
    CATEGORY_DETAILS: (id: string) => `part-type/get/${id}`,
    CATEGORY_CREATE: "part-type/create",
    CATEGORY_UPDATE: (id: string) => `part-type/update/${id}`,
    CATEGORY_DELETE: (id: string) => `part-type/delete/${id}`,
    CATEGORY_UPDATE_STATUS: (id: string) => `part-type/update/${id}/status`,
  }
};
