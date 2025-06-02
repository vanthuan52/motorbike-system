import { useState } from "react";
import Table from "@/components/ui/table/table";
import { Role } from "../types";
import { ColumnsType } from "antd/es/table";
import { getRoleColumns } from "./Columns";
import RolePermissionsModal from "./modal/RolePermissionsModal";

type Props = {
    roles: Role[];
    onEdit: (role: Role) => void;
    onDelete: (id: string) => void;
};

export default function RolesTable({ roles, onEdit, onDelete }: Props) {
    const [viewRole, setViewRole] = useState<Role | null>(null);

    const columns: ColumnsType<Role> = getRoleColumns({
        onEdit,
        onDelete,
        onView: setViewRole,
        roles,
    });

    return (
        <>
            <Table
                rowKey="id"
                columns={columns}
                dataSource={roles}
                pagination={false}
                className="bg-white rounded-lg"
            />
            <RolePermissionsModal
                role={viewRole}
                onClose={() => setViewRole(null)}
            />
        </>
    );
}