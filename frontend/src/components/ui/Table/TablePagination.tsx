// components/Table/TablePagination.tsx
import { Select } from "antd";
import {
  DoubleLeftOutlined,
  LeftOutlined,
  RightOutlined,
  DoubleRightOutlined,
} from "@ant-design/icons";

interface TablePaginationProps {
  currentPage: number;
  totalPages: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
}

/**
 * TablePagination is a component that renders pagination controls for a table.
 *
 * @param {number} currentPage - The current active page number.
 * @param {number} totalPages - The total number of pages available.
 * @param {number} pageSize - The number of records displayed per page.
 * @param {(page: number) => void} onPageChange - Callback function invoked when the page is changed.
 * @param {(size: number) => void} onPageSizeChange - Callback function invoked when the page size is changed.
 *
 * @returns {JSX.Element} The pagination controls for navigating through table data.
 */

const TablePagination = ({
  currentPage,
  totalPages,
  pageSize,
  onPageChange,
  onPageSizeChange,
}: TablePaginationProps) => {
  return (
    <div className="flex items-center justify-end gap-5 px-4 py-2 text-sm">
      <div className="flex items-center gap-2">
        <span className="font-medium">Số bản ghi:</span>
        <Select
          value={pageSize}
          style={{ width: 70 }}
          onChange={onPageSizeChange}
          options={[5, 10, 20, 50].map((n) => ({ value: n, label: n }))}
        />
      </div>

      <div className="flex items-center gap-1">
        <button
          className="px-2 py-1 text-lg disabled:text-gray-300"
          onClick={() => onPageChange(1)}
          disabled={currentPage === 1}
        >
          <DoubleLeftOutlined />
        </button>
        <button
          className="px-2 py-1 text-lg disabled:text-gray-300"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          <LeftOutlined />
        </button>

        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
          <button
            key={page}
            className={`px-2 py-1 font-semibold rounded ${
              page === currentPage ? "text-black" : "text-gray-500"
            }`}
            onClick={() => onPageChange(page)}
          >
            {page}
          </button>
        ))}

        <button
          className="px-2 py-1 text-lg disabled:text-gray-300"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          <RightOutlined />
        </button>
        <button
          className="px-2 py-1 text-lg disabled:text-gray-300"
          onClick={() => onPageChange(totalPages)}
          disabled={currentPage === totalPages}
        >
          <DoubleRightOutlined />
        </button>
      </div>
    </div>
  );
};

export default TablePagination;
