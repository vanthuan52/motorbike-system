import { useEffect, useState } from "react";
import { Button, Modal, Form, Input, Popconfirm, Tooltip } from "antd";
import Table from "@/components/ui/table/table";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { allPermissions as mockPermissions } from "../mocks/role-permissions";
import { PageHeading } from "@/components/page-heading";
import { toast } from "react-toastify";

export interface PermissionItem {
  value: string;
  label: string;
}

export default function PermissionsPage() {
  const [permissions, setPermissions] = useState<PermissionItem[]>();

  const [modalOpen, setModalOpen] = useState(false);
  const [editingPermission, setEditingPermission] =
    useState<PermissionItem | null>(null);
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    setLoading(true);
    setPermissions(mockPermissions);
    setTimeout(() => {
      setLoading(false);
    }, 800);
  }, []);
  if (!permissions) return null;
  const handleCreate = () => {
    setEditingPermission(null);
    form.resetFields();
    setModalOpen(true);
  };

  const handleEdit = (permission: PermissionItem) => {
    setEditingPermission(permission);
    form.setFieldsValue(permission);
    setModalOpen(true);
  };

  const handleDelete = (value: string) => {
    setPermissions(permissions.filter((p) => p.value !== value));
    toast.success("Xoá quyền thành công");
  };

  const handleSubmit = () => {
    form.validateFields().then((values) => {
      if (editingPermission) {
        setPermissions(
          permissions.map((p) =>
            p.value === editingPermission.value ? { ...p, ...values } : p
          )
        );
        toast.success("Cập nhật quyền thành công");
      } else {
        setPermissions([...permissions, values]);
        toast.success("Thêm quyền thành công");
      }
      setModalOpen(false);
    });
  };

  const columns = [
    {
      title: "Mã quyền",
      dataIndex: "value",
      key: "value",
    },
    {
      title: "Tên quyền",
      dataIndex: "label",
      key: "label",
    },
    {
      title: "Hành động",
      key: "actions",
      render: (record: PermissionItem) => (
        <div className="flex gap-2 justify-center">
          <Tooltip title="Sửa">
            <Button
              icon={<EditOutlined />}
              size="small"
              onClick={(e) => {
                e.stopPropagation();
                handleEdit(record);
              }}
            />
          </Tooltip>
          <Popconfirm
            title="Bạn chắc chắn muốn xoá vai trò này?"
            onConfirm={() => handleDelete(record.value)}
            okText="Xoá"
            cancelText="Huỷ"
          >
            <Tooltip title="Xoá">
              <Button
                icon={<DeleteOutlined />}
                size="small"
                danger
                onClick={(e) => e.stopPropagation()}
              />
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
          title="Quản lý quyền"
          onClick={handleCreate}
          addButtonLabel="Thêm quyền"
        />
      </div>

      <div className="bg-white rounded-lg shadow-md">
        <Table
          columns={columns}
          dataSource={permissions}
          loading={loading}
          rowKey="value"
          pagination={{ pageSize: 5 }}
        />
      </div>
      <Modal
        open={modalOpen}
        title={editingPermission ? "Sửa quyền" : "Thêm quyền"}
        onCancel={() => setModalOpen(false)}
        onOk={handleSubmit}
        okText={editingPermission ? "Lưu" : "Thêm"}
        destroyOnHidden
      >
        <Form
          form={form}
          layout="vertical"
          initialValues={editingPermission || { value: "", label: "" }}
        >
          <Form.Item
            label="Mã quyền"
            name="value"
            rules={[{ required: true, message: "Vui lòng nhập mã quyền" }]}
          >
            <Input disabled={!!editingPermission} />
          </Form.Item>
          <Form.Item
            label="Tên quyền"
            name="label"
            rules={[{ required: true, message: "Vui lòng nhập tên quyền" }]}
          >
            <Input placeholder="Nhập tên quyền" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
