"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BREADCRUMB_LABELS } from "@/config/breadcrumb.config";
import { HomeOutlined } from "@ant-design/icons";

function getLabel(segment: string) {
  const lower = segment.toLowerCase();
  if (/^\d+$/.test(lower)) return "Chi tiết";
  return (
    BREADCRUMB_LABELS[lower] || decodeURIComponent(lower).replace(/-/g, " ")
  );
}

export default function Breadcrumb({ customLabel }: { customLabel?: string }) {
  const pathname = usePathname();
  const segments = pathname.split("/").filter(Boolean);

  if (segments.length === 0) return null;

  const collapsed = segments.length > 3;
  const visibleSegments = collapsed
    ? [
        segments[0],
        "...",
        segments[segments.length - 2],
        segments[segments.length - 1],
      ]
    : segments;

  return (
    <div className="py-4 container">
      <div className="text-xs sm:text-sm px-3 py-2 w-full sm:w-fit max-w-full border border-orange-200 bg-orange-50 text-orange-600 rounded truncate">
        <ol className="flex flex-wrap items-center gap-x-1 gap-y-2">
          <li>
            <Link
              href="/"
              className="text-orange-600 font-medium flex items-center gap-1"
            >
              <HomeOutlined className="text-xs" />
              <span className="hover:underline">Trang chủ</span>
            </Link>
          </li>

          {visibleSegments.map((seg, idx) => {
            const isEllipsis = seg === "...";
            const isLast = idx === visibleSegments.length - 1;
            const label = isLast && customLabel ? customLabel : getLabel(seg);
            const path = isEllipsis
              ? "#"
              : "/" +
                segments
                  .slice(
                    0,
                    collapsed ? segments.length - 2 + (idx - 1) : idx + 1
                  )
                  .join("/");

            return (
              <li key={idx} className="flex items-center gap-1">
                <span className="text-orange-400">/</span>
                {isEllipsis ? (
                  <span className="text-orange-400">...</span>
                ) : (
                  <Link href={path} className="text-orange-600 font-medium">
                    <span className="hover:underline">{label}</span>
                  </Link>
                )}
              </li>
            );
          })}
        </ol>
      </div>
    </div>
  );
}
