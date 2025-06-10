import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const formatVND = (price: number) => {
  return price.toLocaleString("vi-VN") + " VNĐ";
};
