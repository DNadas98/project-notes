import { Link } from "react-router-dom";
import React from "react";
import format from "date-fns/format";

function Welcome() {
  const todaysDate = format(new Date(), "yyyy MM dd");
  return (
    <section className="auth_welcome">
      <p>{todaysDate}</p>
      <h1>Welcome!</h1>
      <Link to="/api/notes">
        <button>Projects</button>
      </Link>
      <Link to="/api/users">
        <button>User settings</button>
      </Link>
      <Link to="/">
        <button>Logout</button>
      </Link>
    </section>
  );
}

export default Welcome;
