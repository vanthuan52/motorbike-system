import { EyeOutlined, DeleteOutlined } from "@ant-design/icons";
import { Button, Space } from "antd";

interface Props {
  onView?: () => void;
  onDelete?: () => void;
}

/**
 * A set of action buttons for a table row. The first button is for viewing
 * the row's information, and the second button is for deleting the row.
 *
 * @param {Props} props
 * @prop {() => void} [onView] The function to call when the view button is
 * clicked.
 * @prop {() => void} [onDelete] The function to call when the delete button is
 * clicked.
 * @returns {ReactElement} The action buttons component.
 */

export const ActionButtonsReuse = ({ onView, onDelete }: Props) => {
  return (
    <Space>
      <Button icon={<EyeOutlined />} onClick={onView} />
      <Button danger icon={<DeleteOutlined />} onClick={onDelete} />
    </Space>
  );
};
