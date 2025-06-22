import { Outlet } from "react-router-dom";
import DesktopSidebar from "@/components/desktop-sidebar";
import DesktopHeader from "@/components/desktop-header";
import Breadcrumb from "@/components/breadcrumb";

export default function DesktopLayout() {
  return (
    <div className="flex h-screen overflow-hidden">
      <DesktopSidebar />
      <div className="w-full overflow-x-auto flex flex-col flex-1">
        <DesktopHeader />
        <div className="px-4 pt-2">
          <Breadcrumb />
        </div>
        <div className="flex-1 overflow-y-auto h-full sm:h-auto">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
