"use client";

import { mockUser } from "@/data/UserProfile";
import UserProfile from "./userProfile";
import UserLayout from "@/layout/UserLayout";

export default function layout() {
  return (
    <UserLayout>
      <UserProfile user={mockUser} completionPercent={70} />
    </UserLayout>
  );
}
