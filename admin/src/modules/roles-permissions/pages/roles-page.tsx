import { useState } from "react";
import { toast } from "react-toastify";
import { roles as mockRoles } from "../mocks/role-permissions";
import { Role } from "../types";
import { PageHeading } from "@/components/page-heading";
import RolesTable from "../components/RolesTable";
import RoleModal from "../components/modal/RoleModal";

export default function RolesPage() {
    const [roles, setRoles] = useState<Role[]>(mockRoles);
    const [modalOpen, setModalOpen] = useState(false);
    const [editingRole, setEditingRole] = useState<Role | null>(null);

    const handleCreate = () => {
        setEditingRole(null);
        setModalOpen(true);
    };

    const handleEdit = (role: Role) => {
        setEditingRole(role);
        setModalOpen(true);
    };

    const handleDelete = (id: string) => {
        setRoles(roles.filter(r => r.id !== id));
        toast.success("Xoá vai trò thành công");
    };

    const handleSubmit = (role: Role) => {
        if (editingRole) {
            setRoles(roles.map(r => (r.id === role.id ? role : r)));
            toast.success("Cập nhật vai trò thành công");
        } else {
            setRoles([...roles, { ...role, id: Date.now().toString(), created_at: new Date().toISOString(), updated_at: new Date().toISOString() }]);
            toast.success("Thêm vai trò thành công");
        }
        setModalOpen(false);
    };

    return (
        <div className="sm:px-4 pt-8 sm:pt-0">
            <PageHeading
                title="Quản lý phân quyền"
                onClickAdd={handleCreate}
                addButtonLabel="Thêm vai trò"
            />
            <RolesTable
                roles={roles}
                onEdit={handleEdit}
                onDelete={handleDelete}
            />
            <RoleModal
                open={modalOpen}
                onCancel={() => setModalOpen(false)}
                onSubmit={handleSubmit}
                editingRole={editingRole}
            />
        </div>
    );
}