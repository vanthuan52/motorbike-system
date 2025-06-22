import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button, Col, Input, Popconfirm, Row, Tooltip } from "antd";
import {
  EditOutlined,
  DeleteOutlined,
  ReloadOutlined,
} from "@ant-design/icons";
import { ColumnsType } from "antd/es/table";
import Table from "@/components/ui/table/table";
import { PageHeading } from "@/components/page-heading";
import { RootState } from "@/store";
import { vehicleCompanyActions } from "../store/vehicleCompany-slice";
import { VehicleCompanyTypes } from "../types";
import VehicleCompanyModal from "../components/vehicle-company-modal";

export default function VehicleCompanyPage() {
  const dispatch = useDispatch();
  const { companies, isLoading, total } = useSelector(
    (state: RootState) => state.vehicleCompany
  );

  const [payload, setPayload] = useState({
    name: "",
    page: 1,
    limit: 5,
  });

  const [modalVisible, setModalVisible] = useState(false);
  const [editData, setEditData] = useState<VehicleCompanyTypes | null>(null);

  useEffect(() => {
    dispatch(vehicleCompanyActions.fetchCompaniesRequest());
  }, [dispatch]);

  const handleDelete = (id: string) => {
    dispatch(vehicleCompanyActions.deleteCompanyRequest(id));
  };

  const openCreate = () => {
    setEditData(null);
    setModalVisible(true);
  };

  const openEdit = (record: VehicleCompanyTypes) => {
    setEditData(record);
    setModalVisible(true);
  };

  const handleCloseModal = () => {
    setModalVisible(false);
    setEditData(null);
  };

  const handleResetFilter = () => {
    setPayload({ name: "", page: 1, limit: 5 });
  };

  const columns: ColumnsType<VehicleCompanyTypes> = [
    {
      title: "Mã",
      dataIndex: "id",
      key: "id",
      width: 100,
      align: "center",
    },
    {
      title: "Tên hãng xe",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Mô tả",
      dataIndex: "description",
      key: "description",
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (status) => (
        <span
          className={`px-2 py-1 rounded text-white text-xs ${
            status ? "bg-green-500" : "bg-gray-400"
          }`}
        >
          {status ? "Đang hoạt động" : "Ngừng hoạt động"}
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
          <Tooltip title="Chỉnh sửa">
            <Button
              icon={<EditOutlined />}
              size="small"
              onClick={() => openEdit(record)}
            />
          </Tooltip>
          <Popconfirm
            title="Bạn có chắc chắn muốn xóa hãng xe này?"
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
      <div className="lg:my-4 sm:my-2">
        <PageHeading
          title="Hãng xe"
          onClick={openCreate}
          addButtonLabel="Thêm hãng xe"
        />
      </div>

      <div className="bg-white rounded-lg shadow-md">
        <div className="mb-4 px-5 pt-4">
          <Row gutter={16} style={{ marginBottom: 16 }}>
            <Col>
              <Input
                placeholder="Tìm theo tên hãng xe"
                value={payload.name}
                onChange={(e) =>
                  setPayload({ ...payload, name: e.target.value })
                }
                allowClear
                style={{ width: 240, height: 40 }}
              />
            </Col>
            <Col>
              <Button
                icon={<ReloadOutlined />}
                onClick={handleResetFilter}
                style={{ height: 40 }}
              >
                Đặt lại
              </Button>
            </Col>
          </Row>
        </div>

        <Table
          dataSource={companies}
          columns={columns}
          loading={isLoading}
          rowKey="id"
          pagination={{
            pageSize: payload.limit,
            current: payload.page,
            total,
            onChange: (page, pageSize) => {
              setPayload({ ...payload, page, limit: pageSize });
            },
          }}
        />
      </div>

      <VehicleCompanyModal
        visible={modalVisible}
        mode={editData ? "edit" : "create"}
        initialData={editData}
        onCancel={handleCloseModal}
      />
    </div>
  );
}
