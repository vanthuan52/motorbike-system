"use client";

import React, { ReactNode } from "react";
import { ThemeProvider } from "next-themes";
import { AppProgressBar } from "@/lib/nprogress";

const originalError = console.error;

// Suppress the React 19 script warning in development from next-themes
if (typeof window !== "undefined" && process.env.NODE_ENV === "development") {
  console.error = (...args: any[]) => {
    if (
      typeof args[0] === "string" &&
      args[0].includes("Encountered a script tag while rendering React component")
    ) {
      return;
    }
    originalError.apply(console, args);
  };
}

export interface AppProvider {
  children: ReactNode;
}

const AppProvider = ({ children }: AppProvider) => {
  return (
    <ThemeProvider
      defaultTheme="light"
      attribute="class"
      disableTransitionOnChange={true}
    >
      <AppProgressBar height={2} color="#3F76FF" />
      {children}
    </ThemeProvider>
  );
};

export default AppProvider;
