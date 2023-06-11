import { Link } from "react-router-dom";
import React from "react";
import format from "date-fns/format";

function ApiHome() {
  const todaysDate = format(new Date(), "yyyy. MM. dd.");
  return (
    <div className="ApiHome column">
      <p>{todaysDate}</p>
      <h1>Welcome!</h1>
      <Link to="/api/notes">
        <button>Your notes</button>
      </Link>
      <Link to="/api/users">
        <button>User settings</button>
      </Link>
      <Link to="/">
        <button>Logout</button>
      </Link>
    </div>
  );
}

export default ApiHome;
