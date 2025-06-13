import { ACCESS_TOKEN_KEY, REFRESH_TOKEN_KEY } from "@/constants/application";
import { localStorageHelper } from "./local-storage-helper";

export function isTokenExpired(exp?: number): boolean {
  if (typeof exp === "undefined" || typeof exp === null) return false;

  const currentTime = Math.floor(Date.now() / 1000);
  return exp < currentTime;
}

/**
 * Converts a time string (e.g., "3m", "7d", "1h") into the corresponding number of seconds.
 * Supports units: 's' (seconds), 'm' (minutes), 'h' (hours), 'd' (days).
 *
 * @param timeString The time string to convert (e.g., "3m", "7d").
 * @returns The corresponding number of seconds, or null if the string is invalid.
 */
export const convertTimeToSeconds = (timeString: string): number | null => {
  if (!timeString || typeof timeString !== "string") {
    console.error("Invalid input: timeString must be a non-empty string.");
    return null;
  }

  // Regex to extract the numeric value and the unit (e.g., "3m" -> number: "3", unit: "m")
  const match = timeString.match(/^(\d+)([smhd])$/);

  if (!match) {
    console.error(
      `Invalid time string format: ${timeString}. Expected format: <number><unit> (e.g., "3m", "7d").`
    );
    return null;
  }

  const value = parseInt(match[1], 10); // Get the numeric value
  const unit = match[2]; // Get the time unit

  if (isNaN(value) || value < 0) {
    console.error(`Invalid numeric value in time string: ${timeString}.`);
    return null;
  }

  let seconds: number;
  switch (unit) {
    case "s": // Seconds
      seconds = value;
      break;
    case "m": // minutes
      seconds = value * 60;
      break;
    case "h": // hours
      seconds = value * 60 * 60;
      break;
    case "d": // days
      seconds = value * 24 * 60 * 60;
      break;
    default:
      console.error(`Unknown time unit: ${unit} in ${timeString}.`);
      return null;
  }

  return seconds;
};

export const getTokens = () => {
  return {
    accessToken: localStorageHelper.getItem(ACCESS_TOKEN_KEY),
    refreshToken: localStorageHelper.getItem(REFRESH_TOKEN_KEY),
  };
};

export const setTokens = (accessToken: string, refreshToken: string) => {
  localStorageHelper.setItem(ACCESS_TOKEN_KEY, accessToken);
  localStorageHelper.setItem(REFRESH_TOKEN_KEY, refreshToken);
};

export const clearTokens = () => {
  localStorageHelper.removeItem(ACCESS_TOKEN_KEY);
  localStorageHelper.removeItem(REFRESH_TOKEN_KEY);
};
