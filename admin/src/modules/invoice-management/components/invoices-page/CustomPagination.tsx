import { useMemo } from "react";
import { Select } from "antd";
import { MdKeyboardArrowLeft, MdKeyboardArrowRight, MdOutlineKeyboardDoubleArrowLeft, MdOutlineKeyboardDoubleArrowRight } from "react-icons/md";

type CustomPaginationProps = {
    current: number;
    pageSize: number;
    total: number;
    onChange: (page: number, pageSize: number) => void;
    pageSizeOptions?: number[];
};

function CustomPagination({
    current,
    pageSize,
    total,
    onChange,
    pageSizeOptions = [10, 20, 50, 100],
}: CustomPaginationProps) {
    const totalPages = Math.ceil(total / pageSize);

    const start = (current - 1) * pageSize + 1;
    const end = Math.min(current * pageSize, total);

    const pages = useMemo(() => {
        const arr: (number | "...")[] = [];
        if (totalPages <= 7) {
            for (let i = 1; i <= totalPages; i++) arr.push(i);
        } else {
            if (current <= 4) {
                arr.push(1, 2, 3, 4, 5, "...", totalPages);
            } else if (current > totalPages - 4) {
                arr.push(1, "...", totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
            } else {
                arr.push(1, "...", current - 1, current, current + 1, "...", totalPages);
            }
        }
        return arr;
    }, [current, totalPages]);

    const btnClass =
        "w-9 h-9 flex items-center justify-center rounded-[8px] border border-gray-300 bg-white text-gray-700 transition-all duration-150 " +
        "hover:bg-gray-50 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-200";
    const activeClass =
        "border-gray-500 text-gray-700 font-semibold !bg-gray-100";
    const disabledClass =
        "opacity-50 cursor-not-allowed bg-gray-100 border-gray-200 text-gray-400";

    return (
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between mt-4 gap-3 sm:gap-0 w-full">
            <div className="text-base text-gray-700 flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-2 w-full sm:w-auto">
                <span>
                    {start} – {end} của {total}
                </span>
                <span className="hidden sm:inline">•</span>
                <span>Kết quả mỗi trang:</span>
                <Select
                    size="middle"
                    value={pageSize}
                    onChange={(v) => onChange(1, v)}
                    options={pageSizeOptions.map((n) => ({ value: n, label: n.toString() }))}
                    className="w-full sm:w-20"
                />
            </div>

            <div className="flex flex-wrap items-center justify-start sm:justify-end space-x-1 w-full sm:w-auto">
                <button
                    onClick={() => current > 1 && onChange(1, pageSize)}
                    disabled={current === 1}
                    className={`${btnClass} ${current === 1 ? disabledClass : ""}`}
                    aria-label="Trang đầu"
                >
                    <MdOutlineKeyboardDoubleArrowLeft />
                </button>
                <button
                    onClick={() => current > 1 && onChange(current - 1, pageSize)}
                    disabled={current === 1}
                    className={`${btnClass} ${current === 1 ? disabledClass : ""}`}
                    aria-label="Trang trước"
                >
                    <MdKeyboardArrowLeft />
                </button>

                {pages.map((p, idx) =>
                    p === "..." ? (
                        <span key={idx} className="w-9 h-9 flex items-center justify-center text-gray-400 select-none">…</span>
                    ) : (
                        <button
                            key={idx}
                            onClick={() => onChange(p as number, pageSize)}
                            className={`${btnClass} ${p === current ? activeClass : ""}`}
                            aria-current={p === current ? "page" : undefined}
                        >
                            {p}
                        </button>
                    )
                )}

                <button
                    onClick={() => current < totalPages && onChange(current + 1, pageSize)}
                    disabled={current === totalPages}
                    className={`${btnClass} ${current === totalPages ? disabledClass : ""}`}
                    aria-label="Trang sau"
                >
                    <MdKeyboardArrowRight />
                </button>
                <button
                    onClick={() => current < totalPages && onChange(totalPages, pageSize)}
                    disabled={current === totalPages}
                    className={`${btnClass} ${current === totalPages ? disabledClass : ""}`}
                    aria-label="Trang cuối"
                >
                    <MdOutlineKeyboardDoubleArrowRight />
                </button>
            </div>
        </div>
    );
}

export default CustomPagination;