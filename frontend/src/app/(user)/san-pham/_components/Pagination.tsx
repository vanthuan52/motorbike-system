import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
    current: number;
    total: number;
    onChange: (page: number) => void;
}

const getVisiblePages = (current: number, total: number) => {
    const delta = 1;
    const range = [];

    for (let i = Math.max(2, current - delta); i <= Math.min(total - 1, current + delta); i++) {
        range.push(i);
    }

    if (current - delta > 2) {
        range.unshift("...");
    }
    if (current + delta < total - 1) {
        range.push("...");
    }

    range.unshift(1);
    if (total > 1) range.push(total);

    return range;
};

export default function Pagination({ current, total, onChange }: PaginationProps) {
    const pages = getVisiblePages(current, total);

    return (
        <div className="relative w-full flex justify-center items-center py-4">
            <button
                onClick={() => onChange(current - 1)}
                disabled={current === 1}
                className="absolute left-4 w-8 h-8 border rounded-full flex items-center justify-center disabled:opacity-30"
            >
                <ChevronLeft size={16} />
            </button>

            <div className="flex items-center gap-2">
                {pages.map((p, i) =>
                    p === "..." ? (
                        <span key={`ellipsis-${i}`} className="px-2 text-gray-400 select-none">
                            ...
                        </span>
                    ) : (
                        <button
                            key={p}
                            onClick={() => onChange(Number(p))}
                            className={`w-8 h-8 text-sm rounded-full flex items-center justify-center transition ${p === current
                                ? "bg-gray-200 font-medium"
                                : "hover:bg-gray-100"
                                }`}
                        >
                            {p}
                        </button>
                    )
                )}
            </div>

            <button
                onClick={() => onChange(current + 1)}
                disabled={current === total}
                className="absolute right-4 w-8 h-8 border rounded-full flex items-center justify-center disabled:opacity-30"
            >
                <ChevronRight size={16} />
            </button>
        </div>
    );
}
