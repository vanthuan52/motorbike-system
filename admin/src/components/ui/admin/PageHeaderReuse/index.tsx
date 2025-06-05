import { Button } from "antd";
interface Props {
  title: string;
  addButtonLabel?: string;
  onClickAdd?: () => void;
  disabledButton?: boolean;
}
export const PageHeaderReuse = ({
  title,
  addButtonLabel,
  onClickAdd,
  disabledButton,
}: Props) => {
  return (
    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 sm:gap-0 mb-4 px-2 sm:px-0 py-4">
      <h2
        className="text-xl sm:text-[26px] font-semibold text-center sm:text-left"
        style={{ wordBreak: "break-word" }}
      >
        {title}
      </h2>
      {disabledButton ? null : (
        <div className="flex justify-center sm:justify-end w-full sm:w-auto">
          <Button
            className="!bg-[#32AE05] !text-white hover:!bg-[#2c8b04] hover:!border-[#2c8b04] !px-5 min-h-[35px] !font-medium w-full sm:w-auto"
            onClick={onClickAdd}
          >
            {addButtonLabel || "Thêm mới"}
          </Button>
        </div>
      )}
    </div>
  );
};
