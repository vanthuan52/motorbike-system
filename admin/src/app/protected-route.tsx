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
  const { isAuthenticated, loading } = useAppSelector((state) => state.auth);

  return !loading ? (
    isAuthenticated ? (
      <>{children}</>
    ) : (
      <>
        <Navigate to={ROUTER_PATH.LOGIN} />
      </>
    )
  ) : null;
};

export default ProtectedRoute;
