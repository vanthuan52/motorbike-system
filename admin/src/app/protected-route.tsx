import React from "react";
import { Navigate } from "react-router-dom";
import { useAppSelector } from "@/store";
import { ROUTER_PATH } from "@/constants/router-path";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isAuthenticated } = useAppSelector((state) => state.auth);
  console.log(isAuthenticated);

  return isAuthenticated ? (
    <>{children}</>
  ) : (
    <Navigate to={ROUTER_PATH.LOGIN} />
  );
};

export default ProtectedRoute;
