/**
 * this function determines whether an HTTP status code represents
 * a successful response
 * @param statusCode
 * @returns
 */
export const isSuccessfulStatus = (statusCode: number): boolean => {
  return statusCode >= 200 && statusCode < 300;
};
