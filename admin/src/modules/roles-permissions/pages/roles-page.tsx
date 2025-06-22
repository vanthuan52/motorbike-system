import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { roles as mockRoles } from "../mocks/role-permissions";
import { Role } from "../types";
import { PageHeading } from "@/components/page-heading";
import RolesTable from "../components/RolesTable";
import RoleModal from "../components/modal/RoleModal";
import SkeletonTable from "@/components/ui/SkeletonTable";

export default function RolesPage() {
  const [roles, setRoles] = useState<Role[]>();
  const [modalOpen, setModalOpen] = useState(false);
  const [editingRole, setEditingRole] = useState<Role | null>(null);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    setLoading(true);
    setRoles(mockRoles);
    setTimeout(() => {
      setLoading(false);
    }, 800);
  }, []);
  if (!roles) return null;
  const handleCreate = () => {
    setEditingRole(null);
    setModalOpen(true);
  };

  const handleEdit = (role: Role) => {
    setEditingRole(role);
    setModalOpen(true);
  };

  const handleDelete = (id: string) => {
    setRoles(roles.filter((r) => r.id !== id));
    toast.success("Xoá vai trò thành công");
  };

  const handleSubmit = (role: Role) => {
    if (editingRole) {
      setRoles(roles.map((r) => (r.id === role.id ? role : r)));
      toast.success("Cập nhật vai trò thành công");
    } else {
      setRoles([
        ...roles,
        {
          ...role,
          id: Date.now().toString(),
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
      ]);
      toast.success("Thêm vai trò thành công");
    }
    setModalOpen(false);
  };

  return (
    <div className="sm:px-4 pt-8 sm:pt-0">
      <div className="lg:my-4 sm:my-2">
        <PageHeading
          title="Quản lý phân quyền"
          onClick={handleCreate}
          addButtonLabel="Thêm vai trò"
        />
      </div>

      <div className="bg-white rounded-lg shadow-md">
        {loading ? (
          <SkeletonTable
            columns={[
              { title: "TÊN VAI TRÒ", width: 200, height: 20 },
              { title: "MÔ TẢ", width: 200, height: 20 },
              { title: "QUYỀN", width: 300, height: 20 },
              { title: "HÀNH ĐỘNG", width: 100, height: 20 },
            ]}
            rows={5}
          />
        ) : (
          <RolesTable
            roles={roles}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        )}
      </div>

      <RoleModal
        open={modalOpen}
        onCancel={() => setModalOpen(false)}
        onSubmit={handleSubmit}
        editingRole={editingRole}
      />
    </div>
  );
}
