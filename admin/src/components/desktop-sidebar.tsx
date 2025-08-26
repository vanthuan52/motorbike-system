import { useState } from "react";
import clsx from "clsx";
import { CgMenuRightAlt } from "react-icons/cg";
import SidebarMenu from "./sidebar/sidebar-menu";
import menuItems from "./sidebar/menu-items";

const DesktopSidebar = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <div
      className={clsx(
        "h-screen bg-[#fff] shadow-sm hidden flex-col border-r border-r-[#ddd] md:flex overflow-auto transition-all duration-300 ease-in-out scrollbar-hidden"
      )}
      style={{
        width: sidebarCollapsed ? "3.25rem" : "16rem",
      }}
    >
      {/* Top Header */}
      <div className="flex items-center justify-between p-4 h-16">
        {!sidebarCollapsed && (
          <span className="font-bold text-md md:text-lg">Logo name.</span>
        )}
        <button
          onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
          className="text-xl cursor-pointer"
        >
          <CgMenuRightAlt />
        </button>
      </div>

      <SidebarMenu
        items={menuItems}
        collapsed={sidebarCollapsed}
        setSidebarCollapsed={setSidebarCollapsed}
      />
    </div>
  );
};

export default DesktopSidebar;
