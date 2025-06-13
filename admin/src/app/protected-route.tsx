import React from "react";
import { Navigate } from "react-router-dom";
import { useAppSelector } from "@/store";
import { ROUTER_PATH } from "@/constants/router-path";
import { ENUM_POLICY_ROLE_TYPE } from "@/modules/role/types";
import { APP_CONFIG } from "@/constants/config";

interface ProtectedRouteProps {
  children: React.ReactNode;
  rolesRequired?: ENUM_POLICY_ROLE_TYPE[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  rolesRequired = [
    ENUM_POLICY_ROLE_TYPE.ADMIN,
    ENUM_POLICY_ROLE_TYPE.SUPER_ADMIN,
    ENUM_POLICY_ROLE_TYPE.MANAGER,
    ENUM_POLICY_ROLE_TYPE.TECHNICIAN,
  ],
}) => {
  const { isAuthenticated, loading, user } = useAppSelector(
    (state) => state.auth
  );

  if (APP_CONFIG.NODE_ENV === "development") {
    return <>{children}</>;
  }

  return !loading ? (
    isAuthenticated ? (
      rolesRequired.includes(user?.role.type as ENUM_POLICY_ROLE_TYPE) ? (
        <>{children}</>
      ) : (
        <>Access Denied</>
      )
    ) : (
      <Navigate to={ROUTER_PATH.LOGIN} />
    )
  ) : null;
};

export default ProtectedRoute;
