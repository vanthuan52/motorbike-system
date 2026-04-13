"use client";

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import Button from "@/components/ui/Button/Button";
import { Ghost } from "lucide-react";
import { TRANSLATION_FILES } from "@/lib/i18n";

export default function BlogNotFound() {
  const router = useRouter();
  const t = useTranslations(TRANSLATION_FILES.BLOG_PAGE);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="flex flex-col items-center justify-center text-center min-h-[70vh] px-4"
    >
      <motion.div
        initial={{ rotate: -10 }}
        animate={{ rotate: 0 }}
        transition={{ type: "spring", stiffness: 120 }}
        className="mb-6"
      >
        <Ghost className="w-20 h-20 text-gray-400 dark:text-gray-600" />
      </motion.div>

      <h1 className="text-3xl font-semibold mb-2 text-gray-800 dark:text-white">
        {t("notFound.title")}
      </h1>

      <p className="text-gray-500 dark:text-gray-400 max-w-md mb-6 text-base">
        {t("notFound.description")}
      </p>

      <Button
        label={t("notFound.backButton")}
        onClick={() => router.push("/blog")}
      />
    </motion.div>
  );
}
