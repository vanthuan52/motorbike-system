import React from "react";
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import RegisterPage from "./_components/Register";
import { TRANSLATION_FILES } from "@/lib/i18n";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations(TRANSLATION_FILES.LOGIN_PAGE);

  return {
    title: t("login.registerTitle"),
    description: t("login.registerSubtitle"),
  };
}

export default function Page() {
  return <RegisterPage />;
}
