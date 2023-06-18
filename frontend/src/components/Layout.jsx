import { Outlet } from "react-router-dom";
import React from "react";
import Header from "./Header";
import Footer from "./Footer";

function Layout() {
  return (
    <div className="Layout">
      <Header pageTitle="Project Notes" />
      <main>
        <Outlet />
      </main>
      <Footer pageTitle="Project Notes" name="Daniel Nadas" />
    </div>
  );
}

export default Layout;
