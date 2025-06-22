import { Link, useLocation } from "react-router-dom";
import { BREADCRUMB_LABELS } from "@/constants/breadcrumb.config";

function getLabelFromSegment(segment: string) {
  const lower = segment.toLowerCase();
  if (/^\d+$/.test(segment)) return "Chi tiết";
  return BREADCRUMB_LABELS[lower] || lower.replace(/-/g, " ");
}

export default function Breadcrumb({
  theme = "green",
}: {
  theme?: "green" | "blue" | "orange";
}) {
  const location = useLocation();
  const segments = location.pathname.split("/").filter(Boolean);

  if (segments.length === 0) return null;

  const themeClasses = {
    green: {
      bg: "bg-green-50",
      border: "border-green-200",
      text: "text-green-600",
    },
    blue: {
      bg: "bg-blue-50",
      border: "border-blue-200",
      text: "text-blue-600",
    },
    orange: {
      bg: "bg-orange-50",
      border: "border-orange-200",
      text: "text-orange-600",
    },
  }[theme];

  return (
    <div className="px-4 pt-3 sm:pt-0">
      <div
        className={`
          text-xs sm:text-sm 
          px-3 py-1.5 
          border rounded 
          ${themeClasses.bg} ${themeClasses.border} ${themeClasses.text} 
          w-fit max-w-full
          whitespace-nowrap overflow-auto scrollbar-none
        `}
      >
        <div className="flex items-center gap-1">
          <Link to="/" className="hover:underline font-medium">
            Trang chủ
          </Link>
          {segments.map((seg, idx) => {
            const path = "/" + segments.slice(0, idx + 1).join("/");
            const label = getLabelFromSegment(decodeURIComponent(seg));
            return (
              <span key={idx} className="flex items-center gap-1">
                <span>/</span>
                <Link to={path} className="hover:underline font-medium">
                  {label}
                </Link>
              </span>
            );
          })}
        </div>
      </div>
    </div>
  );
}
