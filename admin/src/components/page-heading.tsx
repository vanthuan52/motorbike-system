import { Button } from "antd";

interface Props {
  title: string;
  addButtonLabel?: string;
  onClick?: () => void;
  disabledButton?: boolean;
}

export const PageHeading = ({
  title,
  addButtonLabel,
  onClick,
  disabledButton,
}: Props) => {
  return (
    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 sm:gap-0 px-2 sm:px-0 py-2">
      <h2
        className="text-xl sm:text-[26px] font-semibold text-center sm:text-left"
        style={{ wordBreak: "break-word" }}
      >
        {title}
      </h2>
      {disabledButton ? null : (
        <div className="flex justify-center sm:justify-end w-full sm:w-auto">
          <Button
            className="!bg-black !text-white !px-5 min-h-[35px] !font-medium w-full sm:w-auto"
            onClick={onClick}
          >
            {addButtonLabel || "Thêm mới"}
          </Button>
        </div>
      )}
    </div>
  );
};
