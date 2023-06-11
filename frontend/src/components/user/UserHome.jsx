import { Link } from "react-router-dom";
import React from "react";
import format from "date-fns/format";
import useLogout from "../../hooks/useLogout";

function UserHome() {
  const logout = useLogout();
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
      <button
        onClick={async () => {
          await logout();
        }}
      >
        Logout
      </button>
    </div>
  );
}

export default UserHome;
