import React from "react";
import { Outlet } from "react-router-dom";
import useAuth from "../../hooks/auth/useAuth";
import Unauthorized from "./Unauthorized.jsx";
import RefreshHandler from "./RefreshHandler";

function RequireAuth({ allowedRoles }) {
  const { auth } = useAuth();
  const hasAuthState = auth?.username && auth?.accessToken && auth?.roles;
  if (hasAuthState && auth.roles?.find((role) => allowedRoles.includes(role))) {
    return <Outlet />;
  } else if (hasAuthState) {
    return <Unauthorized />;
  } else {
    return <RefreshHandler allowedRoles={allowedRoles} />;
  }
}

export default RequireAuth;
