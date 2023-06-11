import React from "react";
import { useLocation, Navigate, Outlet } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import Unauthorized from "./Unauthorized.jsx";

function RequireAuth({ allowedRoles }) {
  const { auth } = useAuth();
  const location = useLocation();
  if (auth?.username && auth?.accessToken && auth?.roles?.find((role) => allowedRoles.includes(role))) {
    return <Outlet />;
  } else if (auth?.username && auth?.accessToken) {
    return <Unauthorized />;
  } else {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
}

export default RequireAuth;
