"use client";

export default function StatCard({
  title,
  value,
  icon,
}: {
  title: string;
  value: string;
  icon?: React.ReactNode;
}) {
  return (
    <div className="flex-1 bg-white border border-[#E8E8E8] rounded-lg p-4 flex flex-col gap-4">
      {icon}
      <h5 className="text-xl font-bold">{title}</h5>
      <p className="text-base">{value}</p>
    </div>
  );
}
