import { Link } from "react-router-dom";
import React from "react";

function Home() {
  return (
    <div className="Home column">
      <p>
        This is a MERN stack web application built mainly to practice MERN stack, however the app can actually be useful
        as a template for further mern projects.
      </p>
      <h2>Please log in to access your profile</h2>
      <div className="row">
        <Link to="/login">
          <button>Log in</button>
        </Link>
        <Link to="/register">
          <button>Register</button>
        </Link>
      </div>
    </div>
  );
}

export default Home;
