import { Metadata } from "next";
import React from "react";
import ToDoListPage from "./components/ToDoListPage";

export const metadata: Metadata = {
  title: "Danh sách hạng mục công việc",
  description: "Chi tiết công việc bảo trì",
};
export default function Page() {
  return <ToDoListPage />;
}
