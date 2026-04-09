import React from "react";
import { useTranslations } from "next-intl";
import { TRANSLATION_FILES } from "@/lib/i18n";

const AuthCard: React.FC = () => {
  const t = useTranslations(`${TRANSLATION_FILES.LOGIN_PAGE}.authCard`);

  return (
    <div className="bg-[#F3F5F9] p-8 rounded-md h-full flex flex-col justify-center gap-5">
      <h2 className="text-[30px] font-medium mb-2 whitespace-pre-line">
        {t("title")}
      </h2>
      <p className="text-gray-500 text-xl mb-6">{t("description")}</p>
      <div className="bg-gray-800 text-white p-4 rounded-[20px]">
        <p className="text-sm mb-2">{t("highlightNote")}</p>
        <div className="flex items-center gap-4">
          <img
            src="https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=150&auto=format&fit=crop"
            alt="Technician"
            className="w-11 h-11 rounded-full object-cover border-2 border-primary-500"
          />
          <div>
            <p className="font-semibold text-lg">{t("technicianName")}</p>
            <p className="text-sm">{t("technicianTitle")}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthCard;
