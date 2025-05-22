"use client";
import Banner from "@/components/user/user-profile/Banner";
import AvatarSection from "@/components/user/user-profile/AvatarSection";
import UserInfo from "@/components/user/user-profile/UserInfo";
import ProfileCompletion from "@/components/user/user-profile/ProfileCompletion";
import ProfileUpdateForm from "@/components/user/user-profile/ProfileUpdateForm";

import { UserType } from "@/types/User";

interface UserProfileProps {
  user: UserType;
  completionPercent: number;
}

export default function UserProfile({
  user,
  completionPercent,
}: UserProfileProps) {
  return (
    <>
      <Banner />
      <AvatarSection
        photo={user.photo || "/images/avatar/default.jpg"}
        firstName={user.first_name || ""}
        lastName={user.last_name || ""}
      />
      <UserInfo
        email={user.email || ""}
        phone={user.phone || ""}
        dob={user.dob || ""}
        gender={user.gender ?? null}
        ward={user.ward || ""}
        district={user.district || ""}
        city={user.city || ""}
      />
      <ProfileCompletion completionPercent={completionPercent} />
      <ProfileUpdateForm user={user} />
    </>
  );
}
