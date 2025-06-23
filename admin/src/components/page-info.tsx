import { Link, useLocation, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { ROUTER_PATH } from "@/constants/router-path";
import { BREADCRUMB_LABELS } from "@/constants/breadcrumb.config";
import { isId } from "@/utils/id-validator";

type PageInfoProps = {
  name: string;
};

function getLabelFromSegment(segment: string) {
  const lower = segment.toLowerCase();
  if (isId(segment)) {
    return "Chi tiết";
  }

  if (/^\d+$/.test(segment)) return "Chi tiết";
  return BREADCRUMB_LABELS[lower] || lower.replace(/-/g, " ");
}

const PageInfo = ({ name }: PageInfoProps) => {
  const location = useLocation();
  const navigate = useNavigate();
  const segments = location.pathname.split("/").filter(Boolean);

  const breadcrumbLinks = [
    { path: ROUTER_PATH.INDEX, label: "Home" },
    ...segments.map((seg, idx) => {
      const path = "/" + segments.slice(0, idx + 1).join("/");
      const label = getLabelFromSegment(decodeURIComponent(seg));
      return { path, label };
    }),
  ];

  const handleBackToPreviousPage = () => {
    navigate(-1);
  };

  return (
    <div className="w-full bg-white p-1 sm:p-4 rounded-lg">
      <div className="flex items-center justify-between gap-1 sm:gap-3 flex-col sm:flex-row ">
        <div>
          <h2 className="!font-semibold lg:text-xl text-lg">{name}</h2>
        </div>
        <div className="flex gap-2 items-center">
          <div
            onClick={handleBackToPreviousPage}
            className="p-1 rounded-full bg-amber-200 cursor-pointer"
          >
            <ArrowLeft />
          </div>

          {breadcrumbLinks.map((item, idx) => (
            <span key={idx} className="flex items-center gap-2">
              {idx > 0 && (
                <span className="w-1 h-1 rounded-full bg-gray-700"></span>
              )}
              <Link
                to={item.path === location.pathname ? "#" : item.path}
                className="cursor-pointer hover:text-amber-400"
              >
                {item.label}
              </Link>
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PageInfo;
