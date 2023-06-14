import { Link } from "react-router-dom";
import React from "react";
import format from "date-fns/format";
import useLogout from "../../hooks/useLogout";
import useAuth from "../../hooks/useAuth";

function UserHome() {
  const logout = useLogout();
  const { auth } = useAuth();
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
      {auth?.roles?.includes("Admin") && (
        <Link to="/admin">
          <button>Admin Panel</button>
        </Link>
      )}
      <Link to="/">
        <button
          onClick={async () => {
            await logout(true);
          }}
        >
          Logout
        </button>
      </Link>
    </div>
  );
}

export default UserHome;
