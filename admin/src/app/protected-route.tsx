import React from "react";
import { Navigate } from "react-router-dom";
import { useAppSelector } from "@/store";
import { ENUM_POLICY_ROLE_TYPE } from "@/modules/role/types";
import { ROUTER_PATH } from "@/constants/router-path";

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
  const { isAuthenticated, appLoading } = useAppSelector((state) => state.auth);

  if (appLoading) {
    return null;
  }

  if (isAuthenticated) {
    const hasRequiredRole = true;
    if (hasRequiredRole) {
      return <>{children}</>;
    } else {
      return <Navigate to={ROUTER_PATH.INDEX} replace />;
    }
  } else {
    return <Navigate to={ROUTER_PATH.LOGIN} replace />;
  }
};

export default ProtectedRoute;
