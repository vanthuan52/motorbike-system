"use client";

import { mockVehicles } from "@/data/MyVehicle";
import UserSidebar from "../../ho-so/_components/UserSidebar";
import MyVehicle from "./MyVehicle";

export default function MyVehicleLayout() {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <aside>
        <UserSidebar />
      </aside>
      <main className="flex-grow p-6 overflow-auto">
        <MyVehicle vehicles={mockVehicles} />
      </main>
    </div>
  );
}
