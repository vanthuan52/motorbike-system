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
    <div className="flex-1">
      <div className="border bg-white border-[#E8E8E8] rounded-lg flex flex-col">
        <div className="p-4 flex flex-col items-left justify-start gap-4">
          {icon}
          <h5 className="text-xl font-bold text-black ">{title}</h5>
          <p className="text-base text-black">{value}</p>
        </div>
      </div>
    </div>
  );
}
