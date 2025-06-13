import { useAppSelector } from "@/store";
import LoadingOverlay from "./loading-overlay";

export default function GlobalLoading() {
  const authLoading = useAppSelector((state) => state.auth.loading);

  const isAnyLoading = authLoading;

  if (!isAnyLoading) return null;

  return <LoadingOverlay show />;
}
