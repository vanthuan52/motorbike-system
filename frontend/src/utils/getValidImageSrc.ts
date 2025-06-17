export function getValidImageSrc(src?: string) {
  if (!src || typeof src !== "string" || !src.trim())
    return "/images/image-holder-icon.png";
  if (
    src.startsWith("http://") ||
    src.startsWith("https://") ||
    src.startsWith("/")
  )
    return src;
  return "/" + src.replace(/^\/+/, "");
}
