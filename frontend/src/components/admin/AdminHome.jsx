import { Link } from "react-router-dom";
import React from "react";
import format from "date-fns/format";
import useLogout from "../../hooks/useLogout";
import useRefresh from "../../hooks/useRefresh";

function AdminHome() {
  const logout = useLogout();
  /**/
  const refresh = useRefresh();
  /**/
  const todaysDate = format(new Date(), "yyyy. MM. dd.");
  return (
    <div className="AdminHome column">
      <h2>Admin Panel</h2>
      <p>{todaysDate}</p>
      <Link to="/admin/users">
        <button>List users</button>
      </Link>
      <Link to="/user">
        <button>User Panel</button>
      </Link>
      {/**/}
      <button
        onClick={() => {
          refresh();
        }}
      >
        Refresh
      </button>
      {/**/}
      <Link to="/">
        <button
          onClick={async () => {
            await logout();
          }}
        >
          Logout
        </button>
      </Link>
    </div>
  );
}

export default AdminHome;
