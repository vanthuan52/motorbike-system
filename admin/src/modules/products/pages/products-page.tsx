import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Button, Input, Popconfirm, Select, Tooltip } from "antd";
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
  const [payload, setPayload] = useState({
    name: "",
    category_id: null,
    page: 1,
    limit: 5,
  });
  const { products, isLoading, total } = useSelector(
    (state: RootState) => state.products
  );
  useEffect(() => {
    dispatch(productsActions.fetchProductsRequest(payload));
  }, [dispatch, payload]);
  const openCreate = () => {
    navigate(ROUTER_PATH.CREATE_PRODUCT);
  };
  const openEdit = (record: Product) => {
    handleView(record);
  };
  const handleView = (record: Product) => {
    navigate(`${ROUTER_PATH.PRODUCTS}/${record.slug}`);
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
  const handleResetFilter = () => {
    setPayload({ name: "", category_id: null, page: 1, limit: 5 });
  };
  return (
    <div className="sm:px-4 px-2 pt-4">
      <div className="mb-4">
        <PageHeading
          title="Sản phẩm"
          onClick={openCreate}
          addButtonLabel="Thêm sản phẩm"
        />
      </div>

      <div className="bg-white rounded-lg shadow-md px-3 sm:px-5 pb-4">
        <div className="flex flex-col sm:flex-row sm:items-end gap-3 pt-4 mb-4">
          <Input
            placeholder="Tìm theo tên sản phẩm"
            value={payload.name}
            onChange={(e) =>
              setPayload({ ...payload, name: e.target.value, page: 1 })
            }
            allowClear
            className="!h-10 sm:w-52"
          />
          <Select
            placeholder="Chọn danh mục"
            value={payload.category_id}
            onChange={(value) =>
              setPayload({ ...payload, category_id: value, page: 1 })
            }
            allowClear
            className="!h-10 sm:w-44"
          >
            {Object.entries(categoryMap).map(([id, name]) => (
              <Select.Option key={id} value={id}>
                {name}
              </Select.Option>
            ))}
          </Select>
          <Button onClick={handleResetFilter} className="!h-10 sm:w-auto">
            Đặt lại
          </Button>
        </div>

        {isLoading ? (
          <SkeletonTable
            columns={[
              { title: "ID", width: 100, height: 50 },
              { title: "SKU", width: 100, height: 50 },
              { title: "TÊN SẢN PHẨM", width: 100, height: 50 },
              { title: "MÃ HÀNG", width: 100, height: 50 },
              { title: "GIÁ", width: 100, height: 50 },
              { title: "TỒN", width: 100, height: 50 },
              { title: "DANH MỤC", width: 100, height: 50 },
              { title: "TRẠNG THÁI", width: 100, height: 50 },
              { title: "HÀNH ĐỘNG", width: 100, height: 50 },
            ]}
            rows={5}
          />
        ) : (
          <Table
            dataSource={products}
            columns={columns}
            rowKey="id"
            pagination={{
              pageSize: payload.limit,
              current: payload.page,
              total: total,
              onChange: (page, pageSize) => {
                setPayload((prev) => ({
                  ...prev,
                  page,
                  limit: pageSize,
                }));
              },
            }}
          />
        )}
      </div>
    </div>
  );
}
