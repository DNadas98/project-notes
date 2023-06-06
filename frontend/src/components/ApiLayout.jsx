import { Outlet } from "react-router-dom";
import React from "react";

function privateLayout() {
  return (
    <div>
      <div className="api_container">
        <Outlet />
      </div>
    </div>
  );
}

export default privateLayout;
