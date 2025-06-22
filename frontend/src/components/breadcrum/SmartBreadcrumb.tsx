"use client";

import { usePathname } from "next/navigation";
import Breadcrumb from "./Breadcrumb";

interface SmartBreadcrumbProps {
  customLabel?: string;
  disabled?: boolean;
}

export default function SmartBreadcrumb({
  customLabel,
  disabled,
}: SmartBreadcrumbProps) {
  const pathname = usePathname();
  const segments = pathname.split("/").filter(Boolean);

  if (disabled) return null;

  if (segments.length >= 2 && !customLabel) {
    return null;
  }

  return <Breadcrumb customLabel={customLabel} />;
}
