import { Tag, Tooltip } from "antd";
import {
  HiOutlineSortAscending,
  HiOutlineSortDescending,
} from "react-icons/hi";
import dayjs from "dayjs";
import type { ColumnsType, SortOrder } from "antd/es/table/interface";
import { InvoiceManagement, Product } from "../../types";
import { paymentStatusColor } from "../../utils/constants";

const compareString = (a: string, b: string) => a.localeCompare(b);
const compareNumber = (a: number, b: number) => a - b;
const compareDate = (a: string, b: string) => dayjs(a).unix() - dayjs(b).unix();

export const invoiceColumns: ColumnsType<InvoiceManagement> = [
  {
    title: "Mã hóa đơn",
    dataIndex: "id",
    key: "id",
    width: 120,
    render: (id: string) => <b>{id.toUpperCase()}</b>,
    sorter: (a, b) => compareString(a.id, b.id),
    sortDirections: ["ascend", "descend"] as SortOrder[],
    sortIcon: ({ sortOrder }: { sortOrder: SortOrder }) =>
      sortOrder === "ascend" ? (
        <Tooltip title="Sắp xếp tăng dần">
          <HiOutlineSortAscending size={18} />
        </Tooltip>
      ) : (
        <Tooltip title="Sắp xếp giảm dần">
          <HiOutlineSortDescending size={18} />
        </Tooltip>
      ),
    showSorterTooltip: false,
  },
  {
    title: "Sản phẩm",
    dataIndex: "products",
    key: "products",
    width: 220,
    render: (products: Product[]) =>
      products.map((p) => (
        <div key={p.id} className="flex items-center pb-2">
          <img
            src={p.image?.[0] || "https://via.placeholder.com/48"}
            alt={p.name}
            style={{ width: 24, height: 24, borderRadius: 4, marginRight: 8 }}
          />
          <span className="text-base">{p.name}</span>
        </div>
      )),
    sorter: (a, b) =>
      compareString(
        a.products.map((p) => p.name).join(", "),
        b.products.map((p) => p.name).join(", ")
      ),
    sortDirections: ["ascend", "descend"] as SortOrder[],
    sortIcon: ({ sortOrder }: { sortOrder: SortOrder }) =>
      sortOrder === "ascend" ? (
        <Tooltip title="Sắp xếp tăng dần">
          <HiOutlineSortAscending size={18} />
        </Tooltip>
      ) : (
        <Tooltip title="Sắp xếp giảm dần">
          <HiOutlineSortDescending size={18} />
        </Tooltip>
      ),
    showSorterTooltip: false,
  },
  {
    title: "Thanh toán",
    dataIndex: "payment_status",
    key: "payment_status",
    width: 110,
    filters: [
      { text: "Hoàn tất", value: "completed" },
      { text: "Chờ xử lý", value: "pending" },
      { text: "Thất bại", value: "failed" },
    ],
    onFilter: (value, record) => record.payment_status === value,
    render: (status: string) => (
      <Tag color={paymentStatusColor[status]}>
        <span className="text-base">
          {status === "completed"
            ? "Hoàn tất"
            : status === "pending"
              ? "Chờ xử lý"
              : "Thất bại"}
        </span>
      </Tag>
    ),
  },
  {
    title: "Địa chỉ",
    dataIndex: "address",
    key: "address",
    width: 220,
    ellipsis: true,
    render: (address: string) => (
      <span className="text-base max-w-[160px] truncate">{address}</span>
    ),
    sorter: (a, b) => compareString(a.address, b.address),
    sortDirections: ["ascend", "descend"] as SortOrder[],
    sortIcon: ({ sortOrder }: { sortOrder: SortOrder }) =>
      sortOrder === "ascend" ? (
        <Tooltip title="Sắp xếp tăng dần">
          <HiOutlineSortAscending size={18} />
        </Tooltip>
      ) : (
        <Tooltip title="Sắp xếp giảm dần">
          <HiOutlineSortDescending size={18} />
        </Tooltip>
      ),
    showSorterTooltip: false,
  },
  {
    title: "Ngày giao hàng",
    dataIndex: "ship_date",
    key: "ship_date",
    width: 140,
    render: (date: string) => (
      <span className="text-base">
        {dayjs(date).format("HH:mm DD/MM/YYYY")}
      </span>
    ),
    sorter: (a, b) => compareDate(a.ship_date, b.ship_date),
    sortDirections: ["ascend", "descend"] as SortOrder[],
    sortIcon: ({ sortOrder }: { sortOrder: SortOrder }) =>
      sortOrder === "ascend" ? (
        <Tooltip title="Sắp xếp tăng dần">
          <HiOutlineSortAscending size={18} />
        </Tooltip>
      ) : (
        <Tooltip title="Sắp xếp giảm dần">
          <HiOutlineSortDescending size={18} />
        </Tooltip>
      ),
    showSorterTooltip: false,
  },
  {
    title: "Tổng tiền",
    dataIndex: "total",
    key: "total",
    width: 80,
    render: (total: number) => (
      <span className="text-base">
        {total.toLocaleString("vi-VN") + " vnđ"}
      </span>
    ),
    sorter: (a, b) => compareNumber(a.total, b.total),
    sortDirections: ["ascend", "descend"] as SortOrder[],
    sortIcon: ({ sortOrder }: { sortOrder: SortOrder }) =>
      sortOrder === "ascend" ? (
        <Tooltip title="Sắp xếp tăng dần">
          <HiOutlineSortAscending size={18} />
        </Tooltip>
      ) : (
        <Tooltip title="Sắp xếp giảm dần">
          <HiOutlineSortDescending size={18} />
        </Tooltip>
      ),
    showSorterTooltip: false,
  },
];
