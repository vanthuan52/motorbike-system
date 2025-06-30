"use client";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { useParams } from "next/navigation";
import { MdKeyboardArrowLeft } from "react-icons/md";
import { useTranslations } from "next-intl";
import CareerHeader from "../../_components/CareerHeader";
import ApplicationForm from "./ApplicationForm";
import JobDetails from "./JobDetails";
import { Link, TRANSLATION_FILES } from "@/lib/i18n";
import { ROUTER_PATH } from "@/constant/router-path";
import { hiringActions } from "@/features/hiring/store/hiring-slice";
import { RootState } from "@/store";
import CareerDetailSkeletonPage from "./CareerDetailSkeletonPage";

export default function CareerDetailsPage() {
  const t = useTranslations(TRANSLATION_FILES.HIRING_DETAIL);
  const { id } = useParams<{ id: string }>();
  const dispatch = useDispatch();
  const { hiringDetail, loading } = useSelector(
    (state: RootState) => state.hiring
  );

  useEffect(() => {
    dispatch(hiringActions.getHiringDetail({ hiringId: id ?? "" }));
  }, [dispatch, id]);
  if (!hiringDetail)
    return <div className="p-8 text-center">Không tìm thấy công việc</div>;
  if (loading) return <CareerDetailSkeletonPage />;
  return (
    <div className="bg-gray-50 min-h-screen">
      <CareerHeader />
      <div className="container mx-auto px-4 mt-4 sm:mt-8 py-10 ">
        <Link
          href={ROUTER_PATH.HIRING}
          className="flex items-center mb-6 text-gray-700 hover:text-gray-900 hover:!underline transition-all duration-200"
        >
          <MdKeyboardArrowLeft size={20} /> {t("back")}
        </Link>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <JobDetails job={hiringDetail} />
          <div className="lg:col-span-5 border border-gray-200 p-6 rounded-lg">
            <h2 className="text-xl font-bold mb-4">{t("application_form")}</h2>
            <ApplicationForm />
          </div>
        </div>
      </div>
    </div>
  );
}
