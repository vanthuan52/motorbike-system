import React from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

interface Props {
  page: number;
  totalPages: number;
  setPage: (v: number) => void;
}

export default function Pagination({ page, totalPages, setPage }: Props) {
  if (totalPages <= 1) return null;
  return (
    <div className="flex justify-center items-center gap-2 mt-6">
      <button
        className="p-2 rounded border border-gray-300 bg-white text-gray-700 hover:bg-gray-100 disabled:opacity-50"
        onClick={() => setPage(Math.max(1, page - 1))}
        disabled={page === 1}
        aria-label="Trang trước"
      >
        <FaChevronLeft />
      </button>
      {Array.from({ length: totalPages }).map((_, idx) => (
        <button
          key={idx}
          className={`px-3 py-1 rounded border border-gray-300 transition
                        ${
                          page === idx + 1
                            ? "bg-black text-white"
                            : "bg-white text-gray-700 hover:bg-gray-100"
                        }`}
          onClick={() => setPage(idx + 1)}
        >
          {idx + 1}
        </button>
      ))}
      <button
        className="p-2 rounded border border-gray-300 bg-white text-gray-700 hover:bg-gray-100 disabled:opacity-50"
        onClick={() => setPage(Math.min(totalPages, page + 1))}
        disabled={page === totalPages}
        aria-label="Trang sau"
      >
        <FaChevronRight />
      </button>
    </div>
  );
}
