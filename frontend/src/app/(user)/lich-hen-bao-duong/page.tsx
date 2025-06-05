"use client";

import UserSidebar from "../ho-so/_components/UserSidebar";
import MaintenanceSchedule from "./_components/MaintenanceSchedule";

export default function MaintenanceScheduleLayout() {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <aside>
        <UserSidebar />
      </aside>
      <main className="flex-grow p-6 overflow-auto">
        <MaintenanceSchedule />
      </main>
    </div>
  );
}
