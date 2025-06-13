import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ROUTER_PATH } from "@/constants/router-path";
import { useAppSelector } from "@/store";

export const AuthLayout: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const navigate = useNavigate();
  const { isAuthenticated, loading } = useAppSelector((state) => state.auth);

  useEffect(() => {
    if (!loading && isAuthenticated)
      navigate(ROUTER_PATH.INDEX, { replace: true });
  }, [isAuthenticated, loading]);

  if (loading) return;

  return (
    <div className='min-h-screen bg-[url("/images/background/bg-login.png")] bg-[length:100%_100%]'>
      {children}
    </div>
  );
};

export default AuthLayout;
