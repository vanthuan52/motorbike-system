export function isTokenExpired(exp?: number): boolean {
  if (typeof exp === "undefined" || typeof exp === null) return false;

  const currentTime = Math.floor(Date.now() / 1000);
  return exp < currentTime;
}
