import { useEffect, useState } from "react";
import { ColumnsType } from "antd/es/table";
import { Button, Col, Input, Popconfirm, Row, Select, Tooltip } from "antd";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { PageHeading } from "@/components/page-heading";
import Table from "@/components/ui/table/table";
import { GreenSwitch } from "@/components/ui/switch";
import SkeletonTable from "@/components/ui/SkeletonTable";
import { mockCategory } from "../mocks/category-data";
import { Category } from "../types";
import { RootState } from "@/store";
import { categoriesActions } from "../store/categories-slice";
import { ROUTER_PATH } from "@/constants/router-path";
import { mockDataTableVehicleCompany } from "@/modules/vehicle-company/mocks/vehicle-company";

export default function CategoryPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [payload, setPayload] = useState({
    name: "",
    vehicle_company_id: null,
    page: 1,
    limit: 5,
  });
  const { categories, isLoading, total } = useSelector(
    (state: RootState) => state.categories
  );
  useEffect(() => {
    dispatch(categoriesActions.fetchCategoriesRequest(payload));
  }, [dispatch, payload]);
  const openCreate = () => {
    navigate(ROUTER_PATH.CREATE_CATEGORY);
  };

  const openEdit = (record: Category) => {
    handleView(record);
  };
  const handleView = (record: Category) => {
    navigate(`${ROUTER_PATH.CATEGORY}/${record.slug}`);
  };
  const handleDelete = (slug: string) => {
    dispatch(categoriesActions.deleteCategoryRequest(slug));
  };
  const vehicleCompanyMap = Object.fromEntries(
    mockDataTableVehicleCompany.map(item => [item.id, item.name])
  );
  const handleUpdateStatus = (status: boolean, record: Category) => {
    dispatch(
      categoriesActions.updateStatusCategoryRequest({
        slug: record.slug,
        status: !status,
      })
    );
  };
  const columns: ColumnsType<(typeof mockCategory)[0]> = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
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
      render: value => {
        return vehicleCompanyMap[value];
      },
    },
    {
      title: "Mô tả",
      dataIndex: "description",
      key: "description",
      render: value => {
        return <span className='line-clamp-2'>{value}</span>;
      },
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (status: boolean, record: Category) => (
        <GreenSwitch
          checked={status}
          onChange={checked => handleUpdateStatus(status, record)}
        />
      ),
    },
    {
      title: "Hành động",
      key: "action",
      render: (_, record) => (
        <>
          <Tooltip title='Sửa' className='mr-1'>
            <Button icon={<EditOutlined />} onClick={() => openEdit(record)} />
          </Tooltip>

          <Popconfirm
            title='Xác nhận xóa?'
            onConfirm={() => handleDelete(record.id)}
          >
            <Tooltip title='Xóa'>
              <Button icon={<DeleteOutlined />} danger />
            </Tooltip>
          </Popconfirm>
        </>
      ),
    },
  ];
  const handleResetFilter = () => {
    setPayload({ name: "", vehicle_company_id: null, page: 1, limit: 5 });
  };
  return (
    <div className='sm:px-4'>
      <PageHeading
        title='Danh mục phụ tùng'
        onClickAdd={openCreate}
        addButtonLabel='Thêm danh mục'
      />
      <Row gutter={16} style={{ marginBottom: 16 }}>
        <Col>
          <Input
            placeholder='Tìm theo tên'
            value={payload.name}
            onChange={e => setPayload({ ...payload, name: e.target.value })}
            allowClear
            style={{ width: 200 }}
          />
        </Col>
        <Col>
          <Select
            placeholder='Tìm theo hãng xe'
            value={payload.vehicle_company_id}
            onChange={e => setPayload({ ...payload, vehicle_company_id: e })}
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
          <Button type='primary' onClick={() => handleResetFilter()}>
            Đặt lại
          </Button>
        </Col>
      </Row>

      {isLoading ? (
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
          rowKey='id'
          pagination={{
            pageSize: payload.limit,
            current: payload.page,
            total: total,
            onChange: (page, pageSize) => {
              setPayload(prev => ({
                ...prev,
                page,
                limit: pageSize,
              }));
            },
          }}
        />
      )}
    </div>
  );
}
