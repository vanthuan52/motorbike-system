import { useEffect, useState, useMemo, useCallback } from "react";
import { ColumnsType } from "antd/es/table";
import {
  Button,
  Col,
  Input,
  Popconfirm,
  Row,
  Select,
  Tooltip,
  message,
} from "antd";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { PageHeading } from "@/components/page-heading";
import Table from "@/components/ui/table/table";
import { GreenSwitch } from "@/components/ui/switch";
import SkeletonTable from "@/components/ui/SkeletonTable";
import { Category, PartTypeStatus } from "../types";
import { RootState } from "@/store";
import { categoriesActions } from "../store/categories-slice";
import { ROUTER_PATH } from "@/constants/router-path";
import { mockDataTableVehicleCompany } from "@/modules/vehicle-company/mocks/vehicle-company";
import STATUS_OPTIONS from "../constants/status";

function useDebounce<T>(value: T, delay: number): T {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const handler = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debounced;
}

const DEFAULT_FILTER = {
  search: "",
  vehicle_company_id: null,
  page: 1,
  perPage: 5,
  status: null,
};

export default function CategoryPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [payload, setPayload] = useState(DEFAULT_FILTER);
  const debouncedSearch = useDebounce(payload.search, 500);

  const {
    list: { data: categories, total, loading: isLoading },
    updateStatus,
    remove,
  } = useSelector((state: RootState) => state.categories);

  useEffect(() => {
    dispatch(
      categoriesActions.fetchCategoriesRequest({
        search: debouncedSearch,
        vehicle_company_id: payload.vehicle_company_id,
        page: payload.page,
        perPage: payload.perPage,
        status: payload.status ?? undefined,
      })
    );
  }, [
    dispatch,
    debouncedSearch,
    payload.vehicle_company_id,
    payload.page,
    payload.perPage,
    payload.status,
  ]);

  useEffect(() => {
    if (updateStatus.success || remove.success) {
      dispatch(
        categoriesActions.fetchCategoriesRequest({
          search: debouncedSearch,
          vehicle_company_id: payload.vehicle_company_id,
          page: payload.page,
          perPage: payload.perPage,
          status: payload.status ?? undefined,
        })
      );
    }
  }, [updateStatus.success, remove.success]);

  useEffect(() => {
    if (updateStatus.error || remove.error) {
      message.error(updateStatus.error || remove.error);
    }
  }, [updateStatus.error, remove.error]);

  const vehicleCompanyMap = useMemo(
    () =>
      Object.fromEntries(
        mockDataTableVehicleCompany.map((item) => [item.id, item.name])
      ),
    []
  );

  const openCreate = useCallback(
    () => navigate(ROUTER_PATH.CREATE_CATEGORY),
    [navigate]
  );
  const openEdit = useCallback(
    (record: Category) => navigate(`${ROUTER_PATH.CATEGORY}/${record._id}`),
    [navigate]
  );
  const handleDelete = useCallback(
    (id: string) => dispatch(categoriesActions.deleteCategoryRequest({ id })),
    [dispatch]
  );
  const handleResetFilter = useCallback(() => setPayload(DEFAULT_FILTER), []);
  const handleUpdateStatus = useCallback(
    (checked: boolean, record: Category) => {
      dispatch(
        categoriesActions.updateStatusCategoryRequest({
          id: record._id,
          status: checked ? PartTypeStatus.ACTIVE : PartTypeStatus.INACTIVE,
        })
      );
    },
    [dispatch]
  );

  const columns: ColumnsType<Category> = useMemo(
    () => [
      {
        title: "ID",
        dataIndex: "index",
        key: "index",
        render: (_: any, __: Category, index: number) => (
          <span>{index + 1}</span>
        ),
      },
      {
        title: "Tên danh mục",
        dataIndex: "name",
        key: "name",
      },
      {
        title: "Mã hãng xe",
        dataIndex: "vehicle_company_id",
        key: "vehicle_company_id",
        render: (value: string) => vehicleCompanyMap[value] || value,
      },
      {
        title: "Mô tả",
        dataIndex: "description",
        key: "description",
        render: (value: string) => (
          <span className="line-clamp-2">{value}</span>
        ),
      },
      {
        title: "Trạng thái",
        dataIndex: "status",
        key: "status",
        render: (status: PartTypeStatus, record: Category) => (
          <GreenSwitch
            checked={status === PartTypeStatus.ACTIVE}
            loading={updateStatus.loading}
            onChange={(checked) => handleUpdateStatus(checked, record)}
          />
        ),
      },
      {
        title: "Hành động",
        key: "action",
        render: (_: any, record: Category) => (
          <>
            <Tooltip title="Sửa" className="mr-1">
              <Button
                icon={<EditOutlined />}
                onClick={() => openEdit(record)}
              />
            </Tooltip>
            <Popconfirm
              title="Xác nhận xóa?"
              onConfirm={() => handleDelete(record._id)}
            >
              <Tooltip title="Xóa">
                <Button icon={<DeleteOutlined />} danger />
              </Tooltip>
            </Popconfirm>
          </>
        ),
      },
    ],
    [
      vehicleCompanyMap,
      handleUpdateStatus,
      openEdit,
      handleDelete,
      updateStatus.loading,
    ]
  );

  const filterControls = (
    <Row gutter={16} style={{ marginBottom: 16 }}>
      <Col>
        <Input
          placeholder="Tìm theo tên"
          value={payload.search}
          onChange={(e) =>
            setPayload((prev) => ({ ...prev, search: e.target.value, page: 1 }))
          }
          allowClear
          style={{ width: 200 }}
        />
      </Col>
      <Col>
        <Select
          placeholder="Tìm theo hãng xe"
          value={payload.vehicle_company_id}
          onChange={(value) =>
            setPayload((prev) => ({
              ...prev,
              vehicle_company_id: value,
              page: 1,
            }))
          }
          allowClear
          style={{ width: 180 }}
        >
          {Object.entries(vehicleCompanyMap).map(([id, name]) => (
            <Select.Option key={id} value={id}>
              {name}
            </Select.Option>
          ))}
        </Select>
      </Col>
      <Col>
        <Select
          placeholder="Trạng thái"
          value={payload.status}
          onChange={(value) =>
            setPayload((prev) => ({
              ...prev,
              status: value,
              page: 1,
            }))
          }
          allowClear
          style={{ width: 120 }}
          options={STATUS_OPTIONS}
        />
      </Col>
      <Col>
        <Button onClick={handleResetFilter}>Đặt lại</Button>
      </Col>
    </Row>
  );

  const tableContent = isLoading ? (
    <SkeletonTable
      columns={[
        { title: "ID", width: 150, height: 55 },
        { title: "Mã hãng xe", width: 215, height: 55 },
        { title: "Tên danh mục", width: 260, height: 55 },
        { title: "Mô tả", width: 400, height: 55 },
        { title: "Trạng thái", width: 195, height: 55 },
        { title: "Hành động", width: 100, height: 55 },
      ]}
      rows={5}
    />
  ) : (
    <Table
      dataSource={categories}
      columns={columns}
      rowKey="_id"
      pagination={{
        current: payload.page,
        pageSize: payload.perPage,
        total,
        onChange: (page, perPage) =>
          setPayload((prev) => ({ ...prev, page, perPage })),
        showSizeChanger: true,
      }}
    />
  );

  return (
    <div className="sm:px-4">
      <PageHeading
        title="Danh mục phụ tùng"
        onClick={openCreate}
        addButtonLabel="Thêm danh mục"
      />
      {filterControls}
      {tableContent}
    </div>
  );
}
