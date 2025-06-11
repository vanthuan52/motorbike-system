"use client";

import { useAppSelector } from "@/store";
import { LoadingSpinner } from "./loading-spinner";

export default function GlobalLoading() {
  const authLoading = useAppSelector((state) => state.auth.loading);

  const isAnyLoading = authLoading;

  if (!isAnyLoading) return null;

  return <LoadingSpinner overlay text="Đang tải..." />;
}
