import { EyeOutlined, DeleteOutlined } from "@ant-design/icons";
import { Button, Space } from "antd";

interface Props {
  onView?: () => void;
  onDelete?: () => void;
  disabledButtonDelete?: boolean;
}
export const ActionButtonsReuse = ({
  onView,
  onDelete,
  disabledButtonDelete,
}: Props) => {
  return (
    <Space>
      <Button icon={<EyeOutlined />} onClick={onView} />
      {disabledButtonDelete && (
        <Button disabled icon={<DeleteOutlined />} onClick={onDelete} />
      )}
    </Space>
  );
};
