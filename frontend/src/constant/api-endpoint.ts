export const API_ENDPOINTS = {
  PUBLIC: {
    AUTH_LOGIN_CREDENTIAL: "auth/login/credential",
    AUTH_SIGN_UP: "auth/sign-up",
    AUTH_LOGOUT: "session/id/revoke",
    CATEGORIES: "part-type/list",
    CATEGORY_DETAILS: (id: string) => `part-type/get/${id}`,
    HIRING: "hiring/list",
    HIRING_DETAILS: (id: string) => `hiring/get/${id}`,
  },
  SHARED: {
    USER_PROFILE: "user/profile",
    AUTH_REFRESH_TOKEN: "auth/refresh",
  },
};
