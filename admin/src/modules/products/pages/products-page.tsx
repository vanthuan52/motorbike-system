import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Button, Popconfirm, Tooltip } from "antd";
import { EditOutlined, DeleteOutlined, EyeOutlined } from "@ant-design/icons";
import { ColumnsType } from "antd/es/table";
import { Product } from "../types";
import Table from "@/components/ui/table/table";
import { mockProducts } from "../mocks/Products";
import { mockDataTableVehiclePart } from "@/modules/vehicle-parts/mocks/vehicle-part-data";
import { PageHeading } from "@/components/page-heading";
import SkeletonTable from "@/components/ui/SkeletonTable";
import { ROUTER_PATH } from "@/constants/router-path";
import { RootState } from "@/store";
import { productsActions } from "../store/products-slice";

export default function ProductsPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { products, isLoading } = useSelector(
    (state: RootState) => state.products
  );
  useEffect(() => {
    dispatch(productsActions.fetchProductsRequest());
  }, [dispatch]);
  const openCreate = () => {
    navigate(ROUTER_PATH.CREATE_PRODUCT);
  };
  const openEdit = (record: Product) => {
    handleView(record, true);
  };
  const handleView = (record: Product, editMode = false) => {
    if (editMode) {
      navigate(`${ROUTER_PATH.PRODUCTS}/${record.slug}?edit=1`);
    } else {
      navigate(`${ROUTER_PATH.PRODUCTS}/${record.slug}`);
    }
  };
  const handleDelete = (slug: string) => {
    dispatch(productsActions.deleteProductRequest(slug));
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
              onClick={() => handleView(record)}
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
    <div className="sm:px-4 my-10 sm:pt-0">
      <PageHeading
        title="Sản phẩm"
        onClickAdd={openCreate}
        addButtonLabel="Thêm sản phẩm"
      />
      {isLoading ? (
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
          dataSource={products}
          columns={columns}
          rowKey="id"
          pagination={{ pageSize: 5 }}
        />
      )}
    </div>
  );
}
