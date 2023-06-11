import React from "react";
import { Link } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";

function NotFound() {
  return (
    <div className="Layout">
      <Header pageTitle="Project Auth" />
      <main>
        <div className="500 column">
          <h1>404 - Not Found</h1>
          <a href="/">
            <button>Home</button>
          </a>
        </div>
      </main>
      <Footer pageTitle="Project Auth" name="Daniel Nadas" />
    </div>
  );
}

export default NotFound;
