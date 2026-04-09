/**
 * Currency formatting utilities using the built-in Intl.NumberFormat API.
 * No third-party library needed — Intl provides CLDR-based locale support
 * including Vietnamese (vi-VN) and VND currency formatting out of the box.
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/NumberFormat
 */

const VND_FORMATTER = new Intl.NumberFormat("vi-VN", {
  style: "currency",
  currency: "VND",
  maximumFractionDigits: 0,
});

const VND_NO_SYMBOL_FORMATTER = new Intl.NumberFormat("vi-VN", {
  maximumFractionDigits: 0,
});

/**
 * Format a number to Vietnamese currency string with ₫ symbol.
 * @example formatVND(1800000) → "1.800.000 ₫"
 */
export function formatVND(amount: number): string {
  return VND_FORMATTER.format(amount);
}

/**
 * Format a number to Vietnamese currency string without currency symbol.
 * @example formatVNDPlain(1800000) → "1.800.000đ"
 */
export function formatVNDPlain(amount: number): string {
  return VND_NO_SYMBOL_FORMATTER.format(amount) + "đ";
}

/**
 * Parse and format a price value that may be a number, a numeric string,
 * or an already-formatted string (e.g. "Từ 2.500.000đ").
 * Returns the formatted string with "đ" unit.
 *
 * @example
 *   formatPrice(300000)       → "300.000đ"
 *   formatPrice("1800000")    → "1.800.000đ"
 *   formatPrice("Từ 300.000đ") → "Từ 300.000đ"  (passed through unchanged)
 */
export function formatPrice(price: string | number): string {
  const num = typeof price === "number" ? price : Number(price);
  if (!isNaN(num) && String(price).trim() !== "") {
    return formatVNDPlain(num);
  }
  // Already a formatted string — return as-is
  return String(price);
}
