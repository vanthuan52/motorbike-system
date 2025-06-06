"use client";

import { mockVehicles } from "@/data/MyVehicle";
import MyVehicle from "./MyVehicle";
import UserLayout from "@/layout/UserLayout";

export default function MyVehicleLayout() {
  return (
    <UserLayout>
      <MyVehicle vehicles={mockVehicles} />
    </UserLayout>
  );
}
