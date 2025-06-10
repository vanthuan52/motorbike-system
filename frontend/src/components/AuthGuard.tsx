"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { ROUTER_PATH } from "@/constant/router-path";
import { useAppSelector } from "@/store";
import LoadingOverlay from "./ui/loading-overlay";

interface AuthGuardProps {
  children: React.ReactNode;
  allowedRoles?: string[];
}

export default function AuthGuard({ children, allowedRoles }: AuthGuardProps) {
  const { isAuthenticated, user, rehydrated } = useAppSelector(
    (state) => state.auth
  );
  const router = useRouter();

  useEffect(() => {
    if (!rehydrated) return;

    if (!isAuthenticated) {
      router.replace(ROUTER_PATH.LOGIN);
      return;
    }

    if (allowedRoles && !allowedRoles.includes(user?.role.type!)) {
      router.replace("/unauthorized");
    }
  }, [rehydrated, isAuthenticated, user]);

  if (!rehydrated) return <LoadingOverlay show={true} />;
  if (!isAuthenticated) return null;
  if (allowedRoles && !allowedRoles.includes(user?.role.type!)) return null;

  return <>{children}</>;
}
