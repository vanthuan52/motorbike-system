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

  return (
    <div className="text-base text-gray-600 container bg-transparent my-5">
      <ol className="flex flex-wrap items-center gap-1">
        <li>
          <Link
            href="/"
            className="hover:underline text-gray-500 hover:text-black flex items-center gap-1"
          >
            <HomeOutlined className="text-xs" />
            <span>Trang chủ</span>
          </Link>
        </li>

        {segments.map((seg, idx) => {
          const path = "/" + segments.slice(0, idx + 1).join("/");

          const isLast = idx === segments.length - 1;
          const label = isLast && customLabel ? customLabel : getLabel(seg);

          return (
            <li key={idx} className="flex items-center gap-1">
              <span className="mx-1 text-gray-400">/</span>
              <Link
                href={path}
                className="hover:underline text-gray-700 hover:text-black"
              >
                {label}
              </Link>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
