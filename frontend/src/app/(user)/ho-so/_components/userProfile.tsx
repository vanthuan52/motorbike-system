"use client";

import { UserType } from "@/types/User";
import Banner from "./banner";
import AvatarSection from "./avatarSection";
import UserInfo from "./userInfo";
import ProfileUpdateForm from "./profileUpdateForm";
import ProfileCompletion from "./profileCompletion";

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
