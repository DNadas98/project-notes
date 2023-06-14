import { Outlet } from "react-router-dom";
import React from "react";
import Header from "./Header";
import Footer from "./Footer";

function Layout() {
  return (
    <div className="Layout">
      <Header pageTitle="Project Auth" />
      <main>
        <Outlet />
      </main>
      <Footer pageTitle="Project Auth" name="Daniel Nadas" />
    </div>
  );
}

export default Layout;
