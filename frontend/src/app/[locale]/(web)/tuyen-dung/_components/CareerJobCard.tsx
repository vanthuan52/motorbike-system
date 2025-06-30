import clsx from "clsx";
import { ROUTER_PATH } from "@/constant/router-path";
import { FaCalendarDays, FaLocationDot } from "react-icons/fa6";
import { Hiring } from "@/features/hiring/types";
import { Link } from "@/lib/i18n";

export default function CareerJobCard({ job }: { job: Hiring }) {
  return (
    <div
      className={clsx(
        "bg-white rounded-lg border border-gray-200 shadow-sm p-4 mb-3 flex flex-col gap-2 hover:shadow-md transition"
      )}
    >
      <Link href={`${ROUTER_PATH.HIRING}/${job.slug}`}>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
          <div>
            <div className="font-semibold text-lg">{job.title}</div>
            <div className="flex flex-wrap gap-2 text-sm text-gray-500 mt-1">
              <span className="bg-gray-100 px-2 py-0.5 rounded-lg border border-gray-200 font-medium flex items-center gap-1">
                <FaCalendarDays />{" "}
                {job.jobType === "Full-time"
                  ? "Toàn thời gian"
                  : "Bán thời gian"}
              </span>
              <span className="bg-gray-100 px-2 py-0.5 rounded-lg border border-gray-200 font-medium flex items-center gap-1">
                <FaLocationDot /> {job.location}
              </span>
              {/* <span
                className={clsx(
                  "px-2 py-0.5 rounded-lg font-medium",
                  job.tag === "Kỹ thuật" && "bg-blue-100 text-black",
                  job.tag === "Bán hàng" && "bg-green-100 text-black",
                  job.tag === "Kế toán" && "bg-yellow-100 text-black",
                  job.tag === "Marketing" && "bg-pink-100 text-black",
                  job.tag === "CSKH" && "bg-purple-100 text-black"
                )}
              >
                {job.tag}
              </span> */}
            </div>
          </div>
        </div>
        {/* <div className="text-gray-700 text-sm line-clamp-2">
        {job.description}
      </div> */}
      </Link>
    </div>
  );
}
