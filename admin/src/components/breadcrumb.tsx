import { BREADCRUMB_LABELS } from "@/constants/breadcrumb.config";
import { Link, useLocation } from "react-router-dom";

function getLabelFromSegment(segment: string) {
  const lower = segment.toLowerCase();

  if (/^\d+$/.test(segment)) return "Chi tiết";

  return BREADCRUMB_LABELS[lower] || lower.replace(/-/g, " ");
}

export default function Breadcrumb() {
  const location = useLocation();
  const segments = location.pathname.split("/").filter(Boolean);

  return (
    <div className="text-sm py-4">
      <div className="flex flex-wrap items-center gap-1">
        <Link to="/" className="text-gray-400 hover:underline">
          Trang chủ
        </Link>
        {segments.map((seg, idx) => {
          const path = "/" + segments.slice(0, idx + 1).join("/");
          const label = getLabelFromSegment(decodeURIComponent(seg));

          return (
            <span key={idx} className="flex items-center gap-1">
              <span>/</span>
              <Link to={path} className="text-gray-400 hover:underline">
                {label}
              </Link>
            </span>
          );
        })}
      </div>
    </div>
  );
}
