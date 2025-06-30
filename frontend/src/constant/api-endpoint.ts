export const API_ENDPOINTS = {
  PUBLIC: {
    AUTH_LOGIN_CREDENTIAL: "auth/login/credential",
    AUTH_SIGN_UP: "auth/sign-up",
    AUTH_LOGOUT: "session/id/revoke",
    PART_TYPES: "part-type/list",
    PART_TYPE_DETAIL: (slug: string) => `part-type/get/${slug}`,
    HIRING: "hiring/list",
    HIRING_DETAILS: (slug: string) => `hiring/get/${slug}`,
  },
  SHARED: {
    USER_PROFILE: "user/profile",
    AUTH_REFRESH_TOKEN: "auth/refresh",
  },
};
