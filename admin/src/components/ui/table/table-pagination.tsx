import { Select } from "antd";
import { LeftOutlined, RightOutlined } from "@ant-design/icons";

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
  const start = total === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const end = Math.min(currentPage * pageSize, total);

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-2 py-2 text-sm w-full">
      <div className="text-base text-gray-700 flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-2 w-full sm:w-auto">
        <span>
          {start} – {end} của {total}
        </span>
        <span className="hidden sm:inline">•</span>
        <span>Kết quả mỗi trang:</span>
        <Select
          size="middle"
          value={pageSize}
          onChange={onPageSizeChange}
          options={[5, 10, 20, 50].map((n) => ({
            value: n,
            label: n.toString(),
          }))}
          className="w-full sm:w-20"
        />
      </div>

      <div className="flex items-center gap-1 w-full sm:w-auto justify-center sm:justify-end flex-wrap">
        <button
          className="px-2 py-1 text-lg disabled:text-gray-300 cursor-pointer rounded-md"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          <LeftOutlined />
        </button>

        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
          <button
            key={page}
            className={`px-4 py-2 font-semibold rounded cursor-pointer ${
              page === currentPage
                ? "text-black bg-gray-200"
                : "text-gray-500 hover:bg-gray-100"
            }`}
            onClick={() => onPageChange(page)}
          >
            {page}
          </button>
        ))}

        <button
          className="px-2 py-1 text-lg disabled:text-gray-300 cursor-pointer rounded-md"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages || totalPages === 0}
        >
          <RightOutlined />
        </button>
      </div>
    </div>
  );
};

export default TablePagination;
