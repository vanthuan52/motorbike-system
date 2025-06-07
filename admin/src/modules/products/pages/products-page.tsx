import { useEffect, useState } from "react";
import Table from "@/components/ui/table/table";
import { Button, Popconfirm, Tooltip } from "antd";
import { EditOutlined, DeleteOutlined, EyeOutlined } from "@ant-design/icons";
import type { UploadFile } from "antd/es/upload/interface";
import { Product } from "../types";
import { mockProducts } from "../mocks/Products";
import { mockDataTableVehiclePart } from "@/modules/vehicle-parts/mocks/vehicle-part-data";
import { toast } from "react-toastify";
import { ColumnsType } from "antd/es/table";
import ProductsModal from "../components/ProductsModal";
import { PageHeading } from "@/components/page-heading";
import ViewProductModal from "../components/ViewProductModal";
import SkeletonTable from "@/components/ui/SkeletonTable";

export default function ProductsPage() {
  const [dataSource, setDataSource] = useState<Product[]>([]);
  const [isEdit, setIsEdit] = useState(false);
  const [assignVisible, setAssignVisible] = useState(false);
  const [assignVisibleView, setAssignVisibleView] = useState(false);
  const [selected, setSelected] = useState<Product | undefined>(undefined);
  const [selectedView, setSelectedView] = useState<Product | undefined>(
    undefined
  );
  const [loading, setLoading] = useState(true);
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  useEffect(() => {
    const timer = setTimeout(() => {
      setDataSource(mockProducts);
      setLoading(false);
    }, 800);
    return () => clearTimeout(timer);
  }, []);
  const openCreate = () => {
    setIsEdit(false);
    setSelected(undefined);
    setAssignVisible(true);
  };
  const openEdit = (record: Product) => {
    setIsEdit(true);
    setSelected(record);
    setAssignVisible(true);
    setFileList(
      record.image
        ? record.image.map((url, idx) => ({
            uid: `${idx}`,
            name: url.split("/").pop() || `image-${idx}`,
            status: "done",
            url,
          }))
        : []
    );
  };
  const openView = (record: Product) => {
    setSelectedView(record);
    setAssignVisibleView(true);
  };
  const handleAssignSubmit = (values: Product) => {
    if (isEdit && selected) {
      setDataSource((prev) =>
        prev.map((item) => (item.id === selected.id ? values : item))
      );
      toast.success("Cập nhật sản phẩm thành công");
    } else {
      const newId = (() => {
        const ids = dataSource
          .map((item) => Number(item.id.replace("vt-", "")))
          .filter((num) => !isNaN(num));
        const max = ids.length ? Math.max(...ids) : 0;
        return `vt-${max + 1}`;
      })();
      setDataSource((prev) => [...prev, { ...values, id: newId }]);
      toast.success("Tạo sản phẩm mới thành công");
    }
    setAssignVisible(false);
  };
  const handleDelete = (id: string) => {
    setDataSource((prev) => prev.filter((item) => item.id !== id));
    toast.success("Xóa sản phẩm thành công");
  };
  const categoryMap = Object.fromEntries(
    mockDataTableVehiclePart.map((item) => [item.id, item.name])
  );
  const columns: ColumnsType<(typeof mockProducts)[0]> = [
    {
      title: "Mã SP",
      dataIndex: "id",
      key: "id",
      width: 80,
      align: "center",
    },
    {
      title: "SKU",
      dataIndex: "sku",
      key: "sku",
      width: 100,
      align: "center",
    },
    {
      title: "Tên sản phẩm",
      dataIndex: "name",
      key: "name",
      ellipsis: true,
      width: 180,
    },
    {
      title: "Hãng",
      dataIndex: "brand_id",
      key: "brand_id",
      width: 120,
      render: (text) => (
        <span className="text-blue-600 font-medium">{text}</span>
      ),
    },
    {
      title: "Giá bán",
      dataIndex: "price",
      key: "price",
      align: "right",
      width: 120,
      render: (_, record) => record.price.toLocaleString("vi-VN") + " ₫",
    },
    {
      title: "Tồn kho",
      dataIndex: "stock",
      key: "stock",
      width: 100,
      align: "center",
      render: (text) => <span>{text} sản phẩm</span>,
    },
    {
      title: "Danh mục",
      dataIndex: "category_id",
      key: "category_id",
      width: 120,
      render: (id) => (
        <span className="text-gray-700">{categoryMap[id] || id}</span>
      ),
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      width: 100,
      render: (status) => (
        <span
          className={`px-2 py-1 rounded text-white text-xs ${
            status === "in_stock"
              ? "bg-green-500"
              : status === "out_of_stock"
                ? "bg-gray-400"
                : "bg-red-500"
          }`}
        >
          {status === "in_stock"
            ? "Còn hàng"
            : status === "out_of_stock"
              ? "Hết hàng"
              : "Ngừng Kinh doanh"}
        </span>
      ),
    },
    {
      title: "Hành động",
      key: "action",
      width: 120,
      align: "center",
      render: (_, record) => (
        <div className="flex items-center justify-center gap-1">
          <Tooltip title="Xem chi tiết">
            <Button
              icon={<EyeOutlined />}
              size="small"
              onClick={() => openView(record)}
            />
          </Tooltip>
          <Tooltip title="Chỉnh sửa">
            <Button
              icon={<EditOutlined />}
              size="small"
              onClick={() => openEdit(record)}
            />
          </Tooltip>
          <Popconfirm
            title="Bạn chắc chắn muốn xóa sản phẩm này?"
            onConfirm={() => handleDelete(record.id)}
            okText="Xóa"
            cancelText="Hủy"
          >
            <Tooltip title="Xóa">
              <Button icon={<DeleteOutlined />} size="small" danger />
            </Tooltip>
          </Popconfirm>
        </div>
      ),
    },
  ];

  return (
    <div className="sm:px-4 pt-8 sm:pt-0">
      <PageHeading
        title="Sản phẩm"
        onClickAdd={openCreate}
        addButtonLabel="Thêm sản phẩm"
      />
      {loading ? (
        <SkeletonTable
          columns={[
            { title: "ID", width: 100, height: 50 },
            { title: "SKU", width: 100, height: 50 },
            { title: "Tên sản phẩm", width: 100, height: 50 },
            { title: "Mã hàng", width: 100, height: 50 },
            { title: "Giá", width: 100, height: 50 },
            { title: "Tồn", width: 100, height: 50 },
            { title: "Danh mục", width: 100, height: 50 },
            { title: "Trang thái", width: 100, height: 50 },
            { title: "Hành động", width: 100, height: 50 },
          ]}
          rows={5}
        />
      ) : (
        <Table
          dataSource={dataSource}
          columns={columns}
          rowKey="id"
          pagination={{ pageSize: 5 }}
        />
      )}
      <ProductsModal
        visible={assignVisible}
        mode={isEdit ? "edit" : "create"}
        initialData={selected}
        onCancel={() => setAssignVisible(false)}
        onSubmit={handleAssignSubmit}
        fileList={fileList}
        setFileList={setFileList}
      />
      <ViewProductModal
        initialData={selectedView}
        visible={assignVisibleView}
        onCancel={() => setAssignVisibleView(false)}
      />
    </div>
  );
}
