import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Button, Col, Input, Popconfirm, Row, Select, Tooltip } from "antd";
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
    <div className="sm:px-4 my-10 sm:pt-0">
      <div style={{ marginBottom: 16 }}>
        <PageHeading
          title="Sản phẩm"
          onClick={openCreate}
          addButtonLabel="Thêm sản phẩm"
        />
      </div>
      <div className="bg-white rounded-lg shadow-md">
        <div className="mb-4 px-5 pt-4">
          <Row gutter={16} style={{ marginBottom: 16 }}>
            <Col>
              <Input
                placeholder="Tìm theo tên sản phẩm"
                value={payload.name}
                onChange={(e) =>
                  setPayload({ ...payload, name: e.target.value })
                }
                allowClear
                style={{ width: 200, height: 40 }}
              />
            </Col>
            <Col>
              <Select
                placeholder="Chọn danh mục"
                value={payload.category_id}
                onChange={(e) => setPayload({ ...payload, category_id: e })}
                allowClear
                style={{ width: 180, height: 40 }}
              >
                {Object.entries(categoryMap).map(([id, name]) => (
                  <Select.Option key={id} value={id}>
                    {name}
                  </Select.Option>
                ))}
              </Select>
            </Col>
            <Col>
              <Button
                onClick={() => handleResetFilter()}
                style={{ height: 40 }}
              >
                Đặt lại
              </Button>
            </Col>
          </Row>
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
