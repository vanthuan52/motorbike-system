import { Select } from "antd";
import PaginationButton from "./pagination-button";

interface TablePaginationProps {
  currentPage: number;
  pageSize: number;
  total: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
}

const TablePagination = ({
  currentPage,
  pageSize,
  total,
  onPageChange,
  onPageSizeChange,
}: TablePaginationProps) => {
  const totalPages = Math.ceil(total / pageSize);

  const disableLeft = currentPage <= 1;
  const disableRight = currentPage >= totalPages;

  return (
    <div className="flex items-center justify-between text-sm font-black w-full px-5 pb-4">
      <div className="flex flex-1 justify-between items-center gap-2 sm:gap-4">
        <div className="flex items-center gap-2">
          <span className="hidden sm:inline text-sm font-medium whitespace-nowrap">
            Hiển thị
          </span>
          <Select
            size="middle"
            value={pageSize}
            onChange={onPageSizeChange}
            options={[5, 10, 20, 50].map((n) => ({
              value: n,
              label: n.toString(),
            }))}
            className="w-16"
          />
        </div>

        <div className="text-sm font-medium whitespace-nowrap">
          Trang {currentPage} / {totalPages}
        </div>

        <div className="flex items-center gap-1">
          <PaginationButton
            onClick={() => onPageChange(1)}
            disabled={disableLeft}
          >
            <svg
              stroke="currentColor"
              fill="none"
              strokeWidth="2"
              viewBox="0 0 24 24"
              strokeLinecap="round"
              strokeLinejoin="round"
              height="18"
              width="18"
            >
              <path d="m11 17-5-5 5-5"></path>
              <path d="m18 17-5-5 5-5"></path>
            </svg>
          </PaginationButton>

          <PaginationButton
            onClick={() => onPageChange(currentPage - 1)}
            disabled={disableLeft}
          >
            <svg
              stroke="currentColor"
              fill="none"
              strokeWidth="2"
              viewBox="0 0 24 24"
              strokeLinecap="round"
              strokeLinejoin="round"
              height="18"
              width="18"
            >
              <path d="m15 18-6-6 6-6"></path>
            </svg>
          </PaginationButton>

          <PaginationButton
            onClick={() => onPageChange(currentPage + 1)}
            disabled={disableRight}
          >
            <svg
              stroke="currentColor"
              fill="none"
              strokeWidth="2"
              viewBox="0 0 24 24"
              strokeLinecap="round"
              strokeLinejoin="round"
              height="18"
              width="18"
            >
              <path d="m9 18 6-6-6-6"></path>
            </svg>
          </PaginationButton>

          <PaginationButton
            onClick={() => onPageChange(totalPages)}
            disabled={disableRight}
          >
            <svg
              stroke="currentColor"
              fill="none"
              strokeWidth="2"
              viewBox="0 0 24 24"
              strokeLinecap="round"
              strokeLinejoin="round"
              height="18"
              width="18"
            >
              <path d="m6 17 5-5-5-5"></path>
              <path d="m13 17 5-5-5-5"></path>
            </svg>
          </PaginationButton>
        </div>
      </div>
    </div>
  );
};

export default TablePagination;
