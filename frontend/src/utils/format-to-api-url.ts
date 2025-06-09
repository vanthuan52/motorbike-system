export const formatToApiUrl = (
  host: string,
  prefix: string,
  version: string,
  url_type: string
) => {
  return `${host}/${prefix}/v${version}/${url_type}`;
};
