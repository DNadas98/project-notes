import { Outlet } from "react-router-dom";
import React from "react";
import Header from "./Header";
import Footer from "./Footer";

function Layout() {
  return (
    <div>
      <Header pageTitle="Project Auth" />
      <main className="public_content">
        <Outlet />
      </main>
      <Footer pageTitle="Project Auth" name="Daniel Nadas" />
    </div>
  );
}

export default Layout;
