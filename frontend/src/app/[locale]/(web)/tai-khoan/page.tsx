"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAppSelector } from "@/store";
import { ROUTER_PATH } from "@/constant/router-path";
import Banner from "./_components/banner";
import UserInfo from "./_components/user-info";
import AvatarSection from "./_components/avatar-section";
import ProfileUpdateForm from "./_components/profile-update-form";
import ProfileCompletion from "./_components/profile-completion";
import { LoadingSpinner } from "@/components/ui/loading-spinner";

function Page() {
  const { isAuthenticated, user, loading } = useAppSelector(
    (state) => state.auth
  );
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated && !isAuthenticated) {
      router.push(ROUTER_PATH.SIGN_IN);
    }
  }, [isAuthenticated, loading, router]);

  if (loading) {
    return <LoadingSpinner text="Waiting..." />;
  }

  return (
    <div className="container">
      <Banner />
      <AvatarSection user={user} />
      <UserInfo user={user} />
      <ProfileCompletion user={user} completionPercent={75} />
      <ProfileUpdateForm user={user} />
    </div>
  );
}

export default Page;
