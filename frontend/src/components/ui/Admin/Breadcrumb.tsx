"use client";
import React from "react";
import { CustomLink } from "@/components/CustomerLink/CustomLink";

interface BreadcrumbItem {
  label: string;
  href?: string;
  icon?: React.ReactNode;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
}

export default function Breadcrumb({ items }: BreadcrumbProps) {
  return (
    <nav
      className="flex mb-4 w-full overflow-x-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent"
      aria-label="Breadcrumb"
    >
      <ol className="inline-flex flex-nowrap items-center space-x-1 md:space-x-2 rtl:space-x-reverse min-w-0 w-full">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          return (
            <li
              key={index}
              className="inline-flex items-center max-w-[120px] sm:max-w-none"
            >
              {index > 0 && (
                <svg
                  className="rtl:rotate-180 w-3 h-3 !text-gray-400 mx-1 flex-shrink-0"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 6 10"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="m1 9 4-4-4-4"
                  />
                </svg>
              )}

              {isLast ? (
                <span className="ms-1 text-sm font-medium text-gray-500 md:ms-2 dark:text-gray-400 truncate block max-w-[100px] sm:max-w-none">
                  {item.label}
                </span>
              ) : (
                <CustomLink
                  href={item.href || "#"}
                  className="inline-flex items-center text-sm font-medium !text-gray-700 hover:text-blue-600 dark:text-gray-400 dark:hover:text-white truncate max-w-[100px] sm:max-w-none"
                  title={item.label}
                >
                  {item.icon && (
                    <span className="me-2 flex-shrink-0">{item.icon}</span>
                  )}
                  <span className="truncate block">{item.label}</span>
                </CustomLink>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
