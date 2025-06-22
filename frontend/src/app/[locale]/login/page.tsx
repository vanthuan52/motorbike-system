import React from "react";
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import LoginPage from "./_components/Login";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("metaLoginPage");

  return {
    title: t("title"),
    description: t("description"),
  };
}
export default function Page() {
  return <LoginPage />;
}
