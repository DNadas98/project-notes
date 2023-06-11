import { Link } from "react-router-dom";
import React from "react";
import format from "date-fns/format";

function UserHome() {
  const todaysDate = format(new Date(), "yyyy. MM. dd.");
  return (
    <div className="UserHome column">
      <p>{todaysDate}</p>
      <Link to="/user/notes">
        <button>Your notes</button>
      </Link>
      <Link to="/user/settings">
        <button>User settings</button>
      </Link>
      <Link to="/">
        <button>Logout</button>
      </Link>
    </div>
  );
}

export default UserHome;
