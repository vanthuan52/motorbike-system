const UUID_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const OBJECT_ID_REGEX = /^[0-9a-fA-F]{24}$/;

/**
 * Checks if a given string is a valid UUID (v4) or MongoDB ObjectId.
 * @param id The string to validate.
 * @returns true if the string is a valid UUID or ObjectId, false otherwise.
 */
export function isId(id: string | null | undefined): boolean {
  if (typeof id !== "string") {
    return false;
  }

  if (UUID_REGEX.test(id)) {
    return true;
  }

  if (OBJECT_ID_REGEX.test(id)) {
    return true;
  }

  return false;
}
