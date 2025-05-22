"use client";

import UserSidebar from "@/components/user/user-sidebar/UserSidebar";
import UserProfile from "@/components/user/user-profile/userProfile";
import { mockUser } from "@/data/UserProfile";

export default function UserLayout() {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <aside>
        <UserSidebar />
      </aside>
      <main className="flex-grow p-6 overflow-auto">
        <UserProfile user={mockUser} completionPercent={70} />
      </main>
    </div>
  );
}
