import { Modal, Form, Input, Select } from "antd";
import { useEffect } from "react";
import { Role } from "../../types";
import { groupPermissions } from "../../utils/roles";

type Props = {
    open: boolean;
    onCancel: () => void;
    onSubmit: (role: Role) => void;
    editingRole: Role | null;
};



export default function RoleModal({ open, onCancel, onSubmit, editingRole }: Props) {
    const [form] = Form.useForm();

    useEffect(() => {
        if (editingRole) {
            form.setFieldsValue(editingRole);
        } else {
            form.resetFields();
        }
    }, [editingRole, form]);

    const handleOk = async () => {
        const values = await form.validateFields();
        onSubmit({
            ...editingRole,
            ...values,
            updated_at: new Date().toISOString(),
            created_at: editingRole?.created_at || new Date().toISOString(),
            id: editingRole?.id || "",
        });
        form.resetFields();
    };

    return (
        <Modal
            title={editingRole ? "Sửa vai trò" : "Thêm vai trò"}
            open={open}
            onCancel={() => {
                onCancel();
                form.resetFields();
            }}
            onOk={handleOk}
            okText={editingRole ? "Cập nhật" : "Tạo mới"}
            cancelText="Huỷ"
            destroyOnHidden
            centered
            width="100%"
            style={{ maxWidth: 1000, top: 32 }}
        >
            <Form form={form} layout="vertical">
                <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex-1">
                        <Form.Item
                            label="Tên vai trò"
                            name="name"
                            rules={[{ required: true, message: "Nhập tên vai trò" }]}
                        >
                            <Input placeholder="Nhập tên vai trò" />
                        </Form.Item>
                        <Form.Item
                            label="Mô tả"
                            name="description"
                        >
                            <Input.TextArea rows={2} placeholder="Nhập mô tả" />
                        </Form.Item>
                    </div>
                    <div className="flex-1">
                        <Form.Item
                            label="Quyền"
                            name="permissions"
                            rules={[{ required: true, message: "Chọn ít nhất 1 quyền" }]}
                        >
                            <Select
                                mode="multiple"
                                showSearch
                                optionFilterProp="label"
                                placeholder="Chọn quyền"
                                options={groupPermissions()}
                                optionLabelProp="label"
                                style={{ minHeight: 120 }}
                            />
                        </Form.Item>
                    </div>
                </div>
            </Form>
        </Modal>
    );
}