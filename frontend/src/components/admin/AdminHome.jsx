import { Link } from "react-router-dom";
import React, { useEffect, useState } from "react";
import format from "date-fns/format";
import useLogout from "../../hooks/auth/useLogout";
import useRefresh from "../../hooks/auth/useRefresh";
import useApiFetch from "../../hooks/useApiFetch";
import Unauthorized from "../auth/Unauthorized";

function AdminHome() {
  const logout = useLogout();
  const refresh = useRefresh();
  const todaysDate = format(new Date(), "yyyy. MM. dd.");
  const apiFetch = useApiFetch();
  const [loading, setLoading] = useState(true);
  const [valid, setValid] = useState(false);

  useEffect(() => {
    async function validateAdmin() {
      try {
        const { httpResponse } = await apiFetch("GET", "auth/validate/admin");
        if (httpResponse?.status === 200) {
          setValid(true);
        }
        return null;
      } catch (err) {
        setValid(false);
        await logout();
        return null;
      } finally {
        setLoading(false);
      }
    }
    validateAdmin();
  }, [apiFetch, logout]);

  return loading ? (
    <h1>Loading...</h1>
  ) : valid ? (
    <div className="AdminHome column">
      <h2>Admin Panel</h2>
      <p>{todaysDate}</p>
      <Link to="/admin/users">
        <button>Users</button>
      </Link>
      <Link to="/admin/notes/all">
        <button>All notes</button>
      </Link>
      <Link to="/user">
        <button>User Panel</button>
      </Link>
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
  ) : (
    <Unauthorized />
  );
}

export default AdminHome;
