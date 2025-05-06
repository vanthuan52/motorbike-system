import { Button } from "antd";
interface Props {
  title: string;
  addButtonLabel?: string;
  onClickAdd?: () => void;
  disabledButton?: boolean;
}

/**
 * PageHeaderReuse is a reusable component for displaying a page header with a title and an optional add button.
 *
 * Props:
 * - title: The title text to be displayed in the header.
 * - addButtonLabel: Optional label for the add button. Defaults to "Thêm mới" if not provided.
 * - onClickAdd: Optional callback function to be called when the add button is clicked.
 */

export const PageHeaderReuse = ({
  title,
  addButtonLabel,
  onClickAdd,
  disabledButton,
}: Props) => {
  return (
    <div className="flex justify-between items-center mb-4">
      <h2 className="text-[26px] font-semibold">{title}</h2>
      {disabledButton ? null : (
        <Button
          className="!bg-[#32AE05] !text-white hover:!bg-[#2c8b04] hover:!border-[#2c8b04] !px-5 min-h-[35px] !font-medium"
          onClick={onClickAdd}
        >
          {addButtonLabel || "Thêm mới"}
        </Button>
      )}
    </div>
  );
};
