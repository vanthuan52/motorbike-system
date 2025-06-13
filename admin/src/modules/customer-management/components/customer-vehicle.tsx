import React, { useState } from "react";
import { Space, Input, Select, Button, message } from "antd";
import Table from "@/components/ui/table/table";
import { ColumnsType } from "antd/es/table";
import { Vehicle } from "@/types/vehicle";
import { mockDataTableVehicleType } from "@/modules/vehicle-type/mocks/vehicle-type";
import { EditOutlined } from "@ant-design/icons";

interface Props {
  customerId: string;
  vehicleData: Vehicle[];
  editable?: boolean;
  onChange?: (vehicles: Vehicle[]) => void;
}

const CustomerVehicles: React.FC<Props> = ({
  customerId,
  vehicleData,
  editable = false,
  onChange,
}) => {
  const [editingKey, setEditingKey] = useState<string | null>(null);
  const [editRow, setEditRow] = useState<Partial<Vehicle>>({});
  const [data, setData] = useState(() =>
    vehicleData.filter(v => v.customer_id === customerId)
  );

  React.useEffect(() => {
    setData(vehicleData.filter(v => v.customer_id === customerId));
  }, [vehicleData, customerId]);

  const isEditing = (record: Vehicle) => record.id === editingKey;

  const edit = (record: Vehicle) => {
    setEditingKey(record.id);
    setEditRow({ ...record });
  };

  const cancel = () => {
    setEditingKey(null);
    setEditRow({});
  };

  const save = (id: string) => {
    const newData = [...data];
    const idx = newData.findIndex(item => item.id === id);
    if (idx > -1) {
      newData[idx] = { ...newData[idx], ...editRow } as Vehicle;
      setData(newData);
      setEditingKey(null);
      setEditRow({});
      onChange?.(newData);
      message.success("Cập nhật phương tiện thành công!");
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    field: keyof Vehicle
  ) => {
    setEditRow(prev => ({ ...prev, [field]: e.target.value }));
  };

  const handleSelectChange = (value: string, field: keyof Vehicle) => {
    setEditRow(prev => ({ ...prev, [field]: value }));
  };

  const columns: ColumnsType<Vehicle> = [
    {
      title: "STT",
      render: (_, __, index) => index + 1,
      width: 60,
    },
    {
      title: "Ảnh",
      dataIndex: "image_file_name",
      render: (url: string, record: Vehicle) =>
        isEditing(record) ? (
          <Input
            value={editRow.image_file_name ?? ""}
            onChange={e => handleInputChange(e, "image_file_name")}
            placeholder='URL ảnh'
          />
        ) : (
          <Space>
            <img
              src={url}
              alt={record.license_plate}
              className='w-12 h-8 object-cover rounded'
            />
          </Space>
        ),
    },
    {
      title: "Biển xe",
      dataIndex: "license_plate",
      render: (_: unknown, record: Vehicle) =>
        isEditing(record) ? (
          <Input
            value={editRow.license_plate}
            onChange={e => handleInputChange(e, "license_plate")}
          />
        ) : (
          record.license_plate
        ),
    },
    {
      title: "Đời xe",
      dataIndex: "vehicle_model",
      render: (_: unknown, record: Vehicle) =>
        isEditing(record) ? (
          <Input
            value={editRow.vehicle_model ?? ""}
            onChange={e => handleInputChange(e, "vehicle_model")}
          />
        ) : (
          record.vehicle_model
        ),
    },
    {
      title: "Màu xe",
      dataIndex: "color",
      render: (_: unknown, record: Vehicle) =>
        isEditing(record) ? (
          <Input
            value={editRow.color ?? ""}
            onChange={e => handleInputChange(e, "color")}
          />
        ) : (
          record.color
        ),
    },
    {
      title: "Số máy",
      dataIndex: "engine_number",
      render: (_: unknown, record: Vehicle) =>
        isEditing(record) ? (
          <Input
            value={editRow.engine_number ?? ""}
            onChange={e => handleInputChange(e, "engine_number")}
          />
        ) : (
          record.engine_number
        ),
    },
    {
      title: "Số khung",
      dataIndex: "chassis_number",
      render: (_: unknown, record: Vehicle) =>
        isEditing(record) ? (
          <Input
            value={editRow.chassis_number ?? ""}
            onChange={e => handleInputChange(e, "chassis_number")}
          />
        ) : (
          record.chassis_number
        ),
    },
    {
      title: "Loại xe",
      dataIndex: "vehicle_type_id",
      render: (id: string, record: Vehicle) =>
        isEditing(record) ? (
          <Select
            value={editRow.vehicle_type_id}
            onChange={value => handleSelectChange(value, "vehicle_type_id")}
            style={{ minWidth: 100 }}
          >
            {mockDataTableVehicleType.map(type => (
              <Select.Option key={type.id} value={type.id}>
                {type.name}
              </Select.Option>
            ))}
          </Select>
        ) : (
          (mockDataTableVehicleType.find(v => v.id === id)?.name ?? "")
        ),
    },
  ];

  if (editable) {
    columns.push({
      title: "Hành động",
      key: "action",
      render: (_: unknown, record: Vehicle) =>
        isEditing(record) ? (
          <span>
            <Button
              type='link'
              onClick={() => save(record.id)}
              style={{ marginRight: 8 }}
            >
              Lưu
            </Button>
            <Button type='link' onClick={cancel}>
              Hủy
            </Button>
          </span>
        ) : (
          <Button type='link' onClick={() => edit(record)}>
            {<EditOutlined />}
          </Button>
        ),
    });
  }

  return (
    <div className='mt-8 space-y-3'>
      <h2 className='text-2xl font-semibold text-gray-800'>
        Thông tin phương tiện
      </h2>
      <Table
        dataSource={data}
        columns={columns}
        rowKey='id'
        pagination={{ pageSize: 5 }}
      />
    </div>
  );
};

export default CustomerVehicles;
