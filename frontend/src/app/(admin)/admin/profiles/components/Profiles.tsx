"use client";

import { useState } from "react";

import { employeeData } from "@/data/EmployeeData";

import AccountsTabs from "./Accounts/AccountsTabs";

function Profiles() {
  const [avatar, setAvatar] = useState<string | null>(
    employeeData.photo || null
  );

  return (
    <AccountsTabs avatar={avatar} setAvatar={setAvatar} />
  );
}

export default Profiles;