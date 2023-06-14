import { Outlet } from "react-router-dom";
import React from "react";
import UserHeader from "./UserHeader";
import Footer from "../Footer";
import useAuth from "../../hooks/auth/useAuth";

function UserLayout() {
  const { auth } = useAuth();
  const username = auth.username;
  return (
    <div className="UserLayout Layout">
      <UserHeader username={username} />
      <main>
        <Outlet />
      </main>
      <Footer pageTitle="Project Auth" name="Daniel Nadas" />
    </div>
  );
}

export default UserLayout;
