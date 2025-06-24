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
    // user module
    USER_LIST: "user/list",
    USER_LIST_TYPE_USER: "user/list/user",
    USER_DETAIL: (id: string) => `user/get/${id}`,
    USER_CREATE: "user/create",
    USER_UPDATE: (id: string) => `user/update/${id}`,
    USER_UPDATE_STATUS: (id: string) => `user/update/${id}/status`,
    USER_DELETION: (id: string) => `user/delete/${id}`,
    USER_TYPE_USER_CREATE: "user/create/user",
  },
};
