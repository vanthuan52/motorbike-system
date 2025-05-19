import React, { memo } from "react";
import { Toolbar } from "./ui/Toolbar";

const MenuBar = () => {
  return (
    <div className="rte-menu-bar">
      <Toolbar dense></Toolbar>
    </div>
  );
};

export default memo(MenuBar);
