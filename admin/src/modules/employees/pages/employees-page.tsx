import React from "react";
import { PageHeading } from "@/components/page-heading";
import EmployeesList from "../components/employees-list";
import styles from "./employees-page.module.scss";

export default function EmployeePage() {
  return (
    <div className={styles["employees-page"]}>
      <div className={styles["employees-container"]}>
        <PageHeading title="Danh sách nhân viên" />
        <EmployeesList />
      </div>
    </div>
  );
}
