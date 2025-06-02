import { Tag, Popconfirm, Button, Tooltip, Badge } from "antd";
import { EditOutlined, DeleteOutlined, EyeOutlined } from "@ant-design/icons";
import { Role } from "../types";
import { getPermissionColor, getPermissionLabel } from "../utils/roles";
import { ColumnsType } from "antd/es/table";

type GetRoleColumnsProps = {
    onEdit: (role: Role) => void;
    onDelete: (id: string) => void;
    onView: (role: Role) => void;
    roles: Role[];
};

export function getRoleColumns({ onEdit, onDelete, onView, roles }: GetRoleColumnsProps): ColumnsType<Role> {
    return [
        {
            title: "Tên vai trò",
            dataIndex: "name",
            key: "name",
            className: "font-semibold",
        },
        {
            title: "Mô tả",
            dataIndex: "description",
            key: "description",
            responsive: ["md"],
        },
        {
            title: "Quyền",
            dataIndex: "permissions",
            key: "permissions",
            render: (permissions: string[]) => {
                const showCount = 2;
                const display = permissions.slice(0, showCount);
                return (
                    <div className="flex flex-wrap gap-1 items-center justify-center">
                        {display.map(p => (
                            <Tooltip key={p} title={getPermissionLabel(p)}>
                                <Tag color={getPermissionColor(p)} className="mb-1">{getPermissionLabel(p)}</Tag>
                            </Tooltip>
                        ))}
                        {permissions.length > showCount && (
                            <Badge count={permissions.length} style={{ backgroundColor: "#999" }}>
                                <Button
                                    size="small"
                                    icon={<EyeOutlined />}
                                    onClick={e => {
                                        e.stopPropagation();
                                        // Tìm đúng role để truyền cho modal
                                        const role = roles.find(r => r.permissions === permissions);
                                        if (role) onView(role);
                                    }}
                                />
                            </Badge>
                        )}
                    </div>
                );
            },
        },
        {
            title: "Hành động",
            key: "actions",
            render: (record: Role) => (
                <div className="flex gap-2 justify-center">
                    <Tooltip title="Sửa">
                        <Button
                            icon={<EditOutlined />}
                            size="small"
                            onClick={e => {
                                e.stopPropagation();
                                onEdit(record);
                            }}
                        />
                    </Tooltip>
                    <Popconfirm
                        title="Bạn chắc chắn muốn xoá vai trò này?"
                        onConfirm={() => onDelete(record.id)}
                        okText="Xoá"
                        cancelText="Huỷ"
                    >
                        <Tooltip title="Xoá">
                            <Button
                                icon={<DeleteOutlined />}
                                size="small"
                                danger
                                onClick={e => e.stopPropagation()}
                            />
                        </Tooltip>
                    </Popconfirm>
                </div>
            ),
        },
    ];
}