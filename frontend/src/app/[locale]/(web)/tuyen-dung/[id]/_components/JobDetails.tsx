import { useTranslations } from "next-intl";
import { Dot } from "lucide-react";
import { FaCalendarDays, FaLocationDot } from "react-icons/fa6";
import { CiShare2 } from "react-icons/ci";
import { ENUM_HIRING_JOB_TYPE, Hiring } from "@/features/hiring/types";
import { TRANSLATION_FILES } from "@/lib/i18n";

export default function JobDetails({ job }: { job: Hiring }) {
  const t = useTranslations(TRANSLATION_FILES.HIRING_DETAIL);
  const tJobTye = useTranslations(TRANSLATION_FILES.HIRING);

  return (
    <div className="lg:col-span-7 space-y-8">
      <div className="space-y-3">
        <h1 className="text-3xl font-bold text-gray-900">{job.title}</h1>
        <div className="flex flex-wrap gap-2 text-sm text-gray-700">
          <span className="bg-gray-100 px-3 py-1 rounded-lg border border-gray-200 font-medium flex items-center gap-1">
            <FaCalendarDays /> {tJobTye("searchFilter.jobTypes." + job.jobType)}
          </span>
          <span className="bg-gray-100 px-3 py-1 rounded-lg border border-gray-200 font-medium flex items-center gap-1">
            <FaLocationDot /> {job.location}
          </span>
          <span className="bg-gray-100 px-3 py-1 rounded-lg border border-gray-200 font-medium">
            {job.category}
          </span>
          <span className="bg-gray-100 px-3 py-1 rounded-lg border border-gray-200 font-medium flex items-center gap-1">
            <CiShare2 /> {t("share")}
          </span>
        </div>
      </div>

      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-2">
          {t("descriptionTitle")}
        </h2>
        <p className="text-gray-700 whitespace-pre-line leading-relaxed">
          {job.description}
        </p>
      </div>

      {job.requirements && job.requirements.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            {t("requirementsTitle")}
          </h2>
          <ul className="list-disc pl-4 text-gray-700 space-y-1">
            {job.requirements.map((req, index) => (
              <li key={index} className="flex items-start">
                <Dot /> {req}
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {job.salaryRange && (
          <div>
            <h4 className="text-gray-500 text-sm">{t("salary")}</h4>
            <p className="text-gray-800 font-medium">{job.salaryRange}</p>
          </div>
        )}
        {job.applicationDeadline && (
          <div>
            <h4 className="text-gray-500 text-sm">{t("deadline")}</h4>
            <p className="text-gray-800 font-medium">
              {new Date(job.applicationDeadline).toLocaleDateString("vi-VN")}
            </p>
          </div>
        )}
      </div>

      <div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          {t("aboutUsTitle")}
        </h3>
        <p className="text-gray-700 leading-relaxed whitespace-pre-line">
          {t("aboutUsDesc")}
        </p>
      </div>
    </div>
  );
}
