"use client";

import { mockUser } from "@/data/UserProfile";
import UserProfile from "./userProfile";
import UserSidebar from "./UserSidebar";

export default function UserLayout() {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <div>
        <UserSidebar />
      </div>
      <main className="flex-grow p-4 overflow-auto">
        <UserProfile user={mockUser} completionPercent={70} />
      </main>
    </div>
  );
}
