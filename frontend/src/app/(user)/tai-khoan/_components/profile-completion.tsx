import { UserProfile } from "@/features/user/types";

interface ProfileCompletionProps {
  user: UserProfile | null;
  completionPercent: number;
}

export default function ProfileCompletion({
  completionPercent,
}: ProfileCompletionProps) {
  return (
    <div className="mt-10 bg-white shadow rounded-lg p-6">
      <h2 className="text-xl font-semibold mb-4 text-violet-700">
        Tiến độ hoàn thành hồ sơ
      </h2>
      <div className="w-full bg-gray-200 rounded-full h-6 overflow-hidden">
        <div
          className="bg-violet-600 h-6 text-white text-sm flex items-center justify-center font-medium"
          style={{ width: `${completionPercent}%` }}
        >
          {completionPercent}%
        </div>
      </div>
    </div>
  );
}
