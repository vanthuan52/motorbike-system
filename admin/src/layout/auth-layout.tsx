import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ROUTER_PATH } from "@/constants/router-path";
import { useAppSelector } from "@/store";
import { LoadingSpinner } from "@/components/ui/loading-spinner";

export const AuthLayout: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const navigate = useNavigate();
  const { isAuthenticated, loading } = useAppSelector((state) => state.auth);

  useEffect(() => {
    if (!loading && isAuthenticated)
      navigate(ROUTER_PATH.INDEX, { replace: true });
  }, [isAuthenticated, loading, navigate]);

  return (
    <div className="min-h-screen">
      {children}
      {loading && <LoadingSpinner overlay />}
    </div>
  );
};

export default AuthLayout;
