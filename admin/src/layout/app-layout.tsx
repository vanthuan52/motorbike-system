import { Suspense } from "react";
import { useIsMobile } from "@/hooks/use-is-mobile";
import MobileLayout from "./mobile-layout";
import DesktopLayout from "./desktop-layout";
import { LoadingSpinner } from "@/components/ui/loading-spinner";

export default function AppLayout() {
  const isMobile = useIsMobile();

  return (
    <Suspense fallback={<LoadingSpinner overlay />}>
      {isMobile ? <MobileLayout /> : <DesktopLayout />}
    </Suspense>
  );
}
