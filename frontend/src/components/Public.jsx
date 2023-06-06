import { Link } from "react-router-dom";
import React from "react";

function Public() {
  return (
    <section className="public_welcome_section">
      <p>
        Project Auth is a MERN stack web application built mainly to practice MERN stack, however the app can actually
        be useful as a template for further mern projects.
      </p>
      <div className="inline">
        <h2>Please log in to access your profile</h2>
        <Link to="/login">
          <button>Log in</button>
        </Link>
        <Link to="/register">
          <button>Register</button>
        </Link>
      </div>
    </section>
  );
}

export default Public;
