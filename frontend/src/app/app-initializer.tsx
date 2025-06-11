"use client";

import { useEffect, useRef } from "react";
import { useAppDispatch } from "@/store";
import { authActions } from "@/features/auth/store/auth-slice";

function AppInitializer() {
  const dispatch = useAppDispatch();

  const didInitialize = useRef(false);

  useEffect(() => {
    if (!didInitialize.current) {
      dispatch(authActions.getUserProfile());
      didInitialize.current = true;
    }
  }, [dispatch]);

  return null;
}

export default AppInitializer;
