const PaginationButton = ({
  children,
  onClick,
  disabled,
}: {
  children: React.ReactNode;
  onClick: () => void;
  disabled: boolean;
}) => (
  <button
    onClick={disabled ? undefined : onClick}
    disabled={disabled}
    className={`p-2 text-gray-500 ${
      disabled
        ? "text-gray-300 border-none cursor-not-allowed"
        : "hover:bg-gray-100 border border-gray-300 cursor-pointer"
    } rounded`}
  >
    {children}
  </button>
);

export default PaginationButton;
