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
            ? "bg-surface-alt text-text-muted cursor-not-allowed border-border"
            : "bg-surface hover:bg-primary-50 text-text-secondary border-border hover:border-primary-400"
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
              ? "bg-primary-700 text-white border-primary-700 shadow-[var(--shadow-primary)]"
              : "bg-surface text-text-secondary border-border hover:bg-primary-50 hover:border-primary-400"
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
            ? "bg-surface-alt text-text-muted cursor-not-allowed border-border"
            : "bg-surface hover:bg-primary-50 text-text-secondary border-border hover:border-primary-400"
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
