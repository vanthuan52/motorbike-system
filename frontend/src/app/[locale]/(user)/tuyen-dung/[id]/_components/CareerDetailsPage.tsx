"use client";

import { useParams } from "next/navigation";
import { MdKeyboardArrowLeft } from "react-icons/md";

import { careerJobs } from "../../mocks/career";
import CareerHeader from "../../_components/CareerHeader";
import ApplicationForm from "./ApplicationForm";
import JobDetails from "./JobDetails";
import { CustomLink } from "@/components/CustomerLink/CustomLink";
import { ROUTER_PATH } from "@/constant/router-path";

export default function CareerDetailsPage() {
  const { id } = useParams();
  const job = careerJobs.find((job) => job.id === id);

  if (!job)
    return <div className="p-8 text-center">Không tìm thấy công việc</div>;

  return (
    <div className="bg-gray-50 min-h-screen">
      <CareerHeader />
      <div className="container mx-auto px-4 mt-4 sm:mt-8 py-10 ">
        <CustomLink
          href={ROUTER_PATH.HIRING}
          className="flex items-center mb-6 text-gray-700 hover:text-gray-900 hover:!underline transition-all duration-200"
        >
          <MdKeyboardArrowLeft size={20} /> Quay lại
        </CustomLink>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <JobDetails job={job} />
          <div className="lg:col-span-5 border border-gray-200 p-6 rounded-lg">
            <h2 className="text-xl font-bold mb-4">Đơn ứng tuyển</h2>
            <ApplicationForm />
          </div>
        </div>
      </div>
    </div>
  );
}
