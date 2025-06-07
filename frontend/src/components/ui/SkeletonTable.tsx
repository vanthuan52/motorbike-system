
interface SkeletonTableProps {
    columns: { title: string; width?: string | number, height?: string | number }[];
    rows?: number;
}

export default function SkeletonTable({ columns, rows = 5 }: SkeletonTableProps) {
    return (
        <div className="overflow-x-auto animate-pulse">
            <table className="min-w-full divide-y divide-gray-200">
                <thead>
                    <tr>
                        {columns.map((col, idx) => (
                            <th
                                key={idx}
                                className="px-3 py-2 text-center text-sm font-semibold"
                                style={col.width && col.height ? { width: col.width, height: col.height } : {}}
                            >
                                {col.title}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {Array.from({ length: rows }).map((_, i) => (
                        <tr key={i} className="animate-pulse">
                            {columns.map((col, idx) => (
                                <td key={idx} className="px-3 py-3 text-center">
                                    <div
                                        className={`
                                            ${idx === 0
                                                ? "w-16 h-12"
                                                : "h-5 w-20"
                                            }
                                            bg-gray-200 rounded mx-auto
                                        `}
                                        style={
                                            col.width
                                                ? { width: col.width, minWidth: 40, height: 20 }
                                                : {}
                                        }
                                    />
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}