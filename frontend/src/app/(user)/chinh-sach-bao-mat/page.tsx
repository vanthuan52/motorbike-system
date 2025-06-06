"use client";

import UserSidebar from "../ho-so/_components/UserSidebar";
import PrivacyPolicy from "./_components/PrivacyPolicy";

export default function PrivacyPolicyLayout() {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <aside>
        <UserSidebar />
      </aside>
      <main className="flex-grow p-6 overflow-auto">
        <PrivacyPolicy />
      </main>
    </div>
  );
}
