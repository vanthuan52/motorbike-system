function ProductInfo({
  label,
  value,
  children,
  colSpan = 1,
  highlight = false,
}: {
  label: string;
  value?: string;
  children?: React.ReactNode;
  colSpan?: number;
  highlight?: boolean;
}) {
  return (
    <div className={`md:col-span-${colSpan}`}>
      <div className="text-gray-500 text-sm mb-1">{label}</div>
      {children ? (
        children
      ) : (
        <div
          className={highlight ? "text-red-600 font-semibold" : "text-gray-800"}
        >
          {value || <span className="text-gray-400">Không có</span>}
        </div>
      )}
    </div>
  );
}

export default ProductInfo;
