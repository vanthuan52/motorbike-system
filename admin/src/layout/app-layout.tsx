import { Suspense } from "react";
import { useIsMobile } from "@/hooks/use-is-mobile";
import MobileLayout from "./mobile-layout";
import DesktopLayout from "./desktop-layout";
import LoadingOverlay from "@/components/ui/loading-overlay";

export default function AppLayout() {
  const isMobile = useIsMobile();

  return (
    <Suspense fallback={<LoadingOverlay show={true} />}>
      {isMobile ? <MobileLayout /> : <DesktopLayout />}
    </Suspense>
  );
}
