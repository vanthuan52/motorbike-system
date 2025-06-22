import { Metadata } from "next";
import TechnicianMaintenancePage from "./components/MaintenancePage";

export const metadata: Metadata = {
  title: "Lịch bảo dưỡng",
  description: "",
};
export default function Page() {
  return <TechnicianMaintenancePage />;
}
