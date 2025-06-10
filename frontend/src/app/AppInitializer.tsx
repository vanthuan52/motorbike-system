"use client";

import { useEffect } from "react";
import { useAppDispatch } from "@/store";
import { authActions } from "@/features/auth/store/auth-slice";

function AppInitializer() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(authActions.getUserProfile());
  }, [dispatch]);

  return null;
}

export default AppInitializer;
