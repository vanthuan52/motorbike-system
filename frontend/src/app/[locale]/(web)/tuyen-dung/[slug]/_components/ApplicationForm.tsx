"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Upload, FileText } from "lucide-react";

import { TRANSLATION_FILES } from "@/lib/i18n";

export default function ApplicationForm() {
  const t = useTranslations(
    `${TRANSLATION_FILES.HIRING_DETAIL}.applicationForm`
  );
  const [experience, setExperience] = useState("");
  const [fileName, setFileName] = useState("");

  const inputClass =
    "w-full h-10 px-3.5 rounded-lg border border-border bg-surface text-sm text-text-primary placeholder:text-text-muted outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500/20 transition-all";

  return (
    <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
      {/* First Name */}
      <div>
        <label className="text-xs font-semibold text-text-primary mb-1 block">
          {t("firstName")} <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          placeholder={t("firstName")}
          required
          className={inputClass}
        />
      </div>

      {/* Last Name */}
      <div>
        <label className="text-xs font-semibold text-text-primary mb-1 block">
          {t("lastName")} <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          placeholder={t("lastName")}
          required
          className={inputClass}
        />
      </div>

      {/* Email */}
      <div>
        <label className="text-xs font-semibold text-text-primary mb-1 block">
          {t("email")} <span className="text-red-500">*</span>
        </label>
        <input
          type="email"
          placeholder="Email"
          required
          className={inputClass}
        />
      </div>

      {/* Phone */}
      <div>
        <label className="text-xs font-semibold text-text-primary mb-1 block">
          {t("phone")} <span className="text-red-500">*</span>
        </label>
        <input
          type="tel"
          placeholder={t("phone")}
          required
          className={inputClass}
        />
      </div>

      {/* Message */}
      <div>
        <label className="text-xs font-semibold text-text-primary mb-1 block">
          {t("message")}
        </label>
        <textarea
          rows={3}
          placeholder={t("messagePlaceholder")}
          className="w-full px-3.5 py-2.5 rounded-lg border border-border bg-surface text-sm text-text-primary placeholder:text-text-muted outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500/20 transition-all resize-y"
        />
      </div>

      {/* Resume Upload */}
      <div>
        <label className="text-xs font-semibold text-text-primary mb-1 block">
          {t("resume")}
        </label>
        <label className="flex flex-col items-center justify-center gap-2 py-5 rounded-lg border-2 border-dashed border-border hover:border-primary-300 bg-bg-soft cursor-pointer transition-colors">
          {fileName ? (
            <div className="flex items-center gap-2 text-sm text-primary-500 font-medium">
              <FileText size={18} />
              {fileName}
            </div>
          ) : (
            <>
              <Upload size={20} className="text-text-muted" />
              <p className="text-xs text-text-muted text-center">
                {t("uploadInstruction")}{" "}
                <span className="text-primary-500 font-medium">
                  {t("chooseFile")}
                </span>
              </p>
            </>
          )}
          <input
            type="file"
            accept=".pdf,.doc,.docx"
            className="hidden"
            onChange={(e) =>
              setFileName(e.target.files?.[0]?.name || "")
            }
          />
        </label>
      </div>

      {/* Experience */}
      <div>
        <label className="text-xs font-semibold text-text-primary mb-2 block">
          {t("experience")} <span className="text-red-500">*</span>
        </label>
        <div className="space-y-2">
          {[
            { value: "0-2", label: t("expOptions.0_2") },
            { value: "3-5", label: t("expOptions.3_5") },
            { value: ">5", label: t("expOptions.more_5") },
          ].map((opt) => (
            <label
              key={opt.value}
              className={`flex items-center gap-2.5 px-3 py-2 rounded-lg border cursor-pointer transition-all text-sm ${
                experience === opt.value
                  ? "border-primary-500 bg-primary-50/50 text-primary-600"
                  : "border-border text-text-secondary hover:border-primary-200"
              }`}
            >
              <input
                type="radio"
                name="experience"
                value={opt.value}
                checked={experience === opt.value}
                onChange={(e) => setExperience(e.target.value)}
                className="accent-primary-500"
              />
              {opt.label}
            </label>
          ))}
        </div>
      </div>

      {/* Submit */}
      <button
        type="submit"
        className="w-full h-11 rounded-lg bg-primary-500 text-white text-sm font-semibold hover:bg-primary-600 cursor-pointer transition-colors shadow-sm"
      >
        {t("submit")}
      </button>
    </form>
  );
}
