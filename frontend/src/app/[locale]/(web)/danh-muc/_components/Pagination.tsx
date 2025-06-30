import clsx from "clsx";

export default function Pagination({
  page,
  totalPages = 1,
  loading,
  setPage,
  setDirection,
}: {
  page: number;
  totalPages: number | undefined;
  loading: boolean;
  setPage: (p: number) => void;
  setDirection: (d: number) => void;
}) {
  return (
    <div className="flex flex-wrap justify-center mt-10 gap-2">
      <button
        className={clsx(
          "w-10 h-10 flex items-center justify-center rounded-full border text-lg font-semibold transition-all duration-200",
          page === 1
            ? "bg-gray-100 text-gray-400 cursor-not-allowed border-gray-200"
            : "bg-white hover:bg-orange-50 text-gray-700 border-gray-300 hover:border-orange-400"
        )}
        disabled={page === 1 || loading}
        onClick={() => {
          setDirection(-1);
          setPage(Math.max(1, page - 1));
        }}
      >
        &lt;
      </button>
      {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
        <button
          key={p}
          className={clsx(
            "w-10 h-10 flex items-center justify-center rounded-full border text-lg font-semibold transition-all duration-200",
            page === p
              ? "bg-orange-400 text-white border-orange-400 shadow"
              : "bg-white text-gray-700 border-gray-300 hover:bg-orange-50 hover:border-orange-400"
          )}
          disabled={loading}
          onClick={() => {
            setDirection(p > page ? 1 : -1);
            setPage(p);
          }}
        >
          {p}
        </button>
      ))}
      <button
        className={clsx(
          "w-10 h-10 flex items-center justify-center rounded-full border text-lg font-semibold transition-all duration-200",
          page === totalPages
            ? "bg-gray-100 text-gray-400 cursor-not-allowed border-gray-200"
            : "bg-white hover:bg-orange-50 text-gray-700 border-gray-300 hover:border-orange-400"
        )}
        disabled={page === totalPages || loading}
        onClick={() => {
          setDirection(1);
          setPage(Math.min(totalPages, page + 1));
        }}
      >
        &gt;
      </button>
    </div>
  );
}
