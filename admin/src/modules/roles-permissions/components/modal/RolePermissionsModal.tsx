import { Modal, Tag, Tooltip } from "antd";
import { Role } from "../../types";
import { permissionGroups } from "../../constant/roles";
import { getPermissionColor, getPermissionGroup, getPermissionLabel } from "../../utils/roles";

type Props = {
    role: Role | null;
    onClose: () => void;
};

function groupPermissions(permissions: string[]) {
    const grouped: Record<string, string[]> = {};
    permissions.forEach(p => {
        const group = getPermissionGroup(p);
        if (!grouped[group]) grouped[group] = [];
        grouped[group].push(p);
    });
    return grouped;
}

export default function RolePermissionsModal({ role, onClose }: Props) {
    return (
        <Modal
            open={!!role}
            title={
                <div>
                    Chi tiết quyền của vai trò: <span className="font-semibold">{role?.name}</span>
                </div>
            }
            onCancel={onClose}
            footer={null}
            afterClose={() => {
                const modal = document.querySelector('.ant-modal-body');
                if (modal) modal.scrollTop = 0;
            }}
            maskClosable
            destroyOnHidden
        >
            {role && (
                <div>
                    {Object.entries(groupPermissions(role.permissions)).map(([group, perms]) => (
                        <div key={group} className="mb-3">
                            <div className="font-semibold mb-1 flex items-center gap-2">
                                {permissionGroups[group]?.label || group}
                                <span className="text-xs text-gray-400">({perms.length} quyền)</span>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {perms.map(p => (
                                    <Tooltip key={p} title={p}>
                                        <Tag color={getPermissionColor(p)}>{getPermissionLabel(p)}</Tag>
                                    </Tooltip>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </Modal>
    );
}