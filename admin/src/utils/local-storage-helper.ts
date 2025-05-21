import { ACCESS_TOKEN, EXPIRES_IN } from "@/constants/config";

export const localStorageHelper = {
  setAuthToken: (accessToken: string, expiresIn: number) => {
    localStorage.setItem(ACCESS_TOKEN, accessToken);
    localStorage.setItem(EXPIRES_IN, expiresIn.toString());
  },
  getAuthToken: () => {
    const accessToken = localStorage.getItem(ACCESS_TOKEN);
    const expiresIn = localStorage.getItem(EXPIRES_IN);
    return {
      accessToken: accessToken ? accessToken : "",
      expiresIn: expiresIn ? parseInt(expiresIn, 10) : null,
    };
  },
  isAuthTokenExpired: () => {
    const expiresIn = localStorage.getItem(EXPIRES_IN);
    if (!expiresIn) return true;
    const now = Math.floor(Date.now() / 1000);
    return now >= parseInt(expiresIn, 10);
  },
  clearAuthToken: () => {
    localStorage.removeItem(ACCESS_TOKEN);
    localStorage.removeItem(EXPIRES_IN);
  },
};
