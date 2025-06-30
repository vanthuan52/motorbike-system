import React from "react";
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import LoginPage from "./_components/Login";
import { TRANSLATION_FILES } from "@/lib/i18n";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations(TRANSLATION_FILES.LOGIN_PAGE);

  return {
    title: t("title"),
    description: t("description"),
  };
}
export default function Page() {
  return <LoginPage />;
}
