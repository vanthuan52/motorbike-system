import { Dot } from "lucide-react";
import { CareerJob } from "../../types";
import { FaCalendarDays, FaLocationDot } from "react-icons/fa6";
import { CiShare2 } from "react-icons/ci";
export default function JobDetails({ job }: { job: CareerJob }) {
  return (
    <div className="lg:col-span-7 space-y-8">
      <div className="space-y-3">
        <h1 className="text-3xl font-bold text-gray-900">{job.title}</h1>
        <div className="flex flex-wrap gap-2 text-sm text-gray-700">
          <span className="bg-gray-100 px-3 py-1 rounded-lg border border-gray-200 font-medium flex items-center gap-1">
            <FaCalendarDays /> {job.job_type}
          </span>
          <span className="bg-gray-100 px-3 py-1 rounded-lg border border-gray-200 font-medium flex items-center gap-1">
            <FaLocationDot /> {job.location}
          </span>
          <span className="bg-gray-100 px-3 py-1 rounded-lg border border-gray-200 font-medium">
            {job.category}
          </span>
          <span className="bg-gray-100 px-3 py-1 rounded-lg border border-gray-200 font-medium flex items-center gap-1">
            <CiShare2 /> Chia sẻ
          </span>
        </div>
      </div>

      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-2">
          Mô tả công việc
        </h2>
        <p className="text-gray-700 whitespace-pre-line leading-relaxed">
          {job.description}
        </p>
      </div>

      {job.requirements && job.requirements.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Yêu cầu công việc
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
        {job.salary_range && (
          <div>
            <h4 className="text-gray-500 text-sm">Mức lương</h4>
            <p className="text-gray-800 font-medium">{job.salary_range}</p>
          </div>
        )}
        {job.application_deadline && (
          <div>
            <h4 className="text-gray-500 text-sm">Hạn nộp hồ sơ</h4>
            <p className="text-gray-800 font-medium">
              {new Date(job.application_deadline).toLocaleDateString("vi-VN")}
            </p>
          </div>
        )}
      </div>

      {/* Thông tin công ty */}
      <div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          Về chúng tôi
        </h3>
        <p className="text-gray-700 leading-relaxed whitespace-pre-line">
          Chúng tôi là một đội ngũ đam mê công nghệ, không ngừng cải tiến trải
          nghiệm người dùng và xây dựng sản phẩm chất lượng cao. Môi trường làm
          việc chuyên nghiệp, thân thiện và sáng tạo.
        </p>
      </div>
    </div>
  );
}
