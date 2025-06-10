"use client";

import MaintenanceSchedule from "./_components/MaintenanceSchedule";

export default function MaintenanceScheduleLayout() {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <div className="container">
        <MaintenanceSchedule />
      </div>
    </div>
  );
}
