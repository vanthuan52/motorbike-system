export const isTokenExpired = (token: string) => {
  if (!token) return true;

  const payload = token.split(".")[1];
  if (!payload) return true;

  const decodedPayload = JSON.parse(atob(payload));

  const exp = decodedPayload.exp;

  return exp * 1000 < Date.now();
};
