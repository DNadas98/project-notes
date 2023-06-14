import React, { useEffect, useState } from "react";
import useApiFetch from "../../../hooks/useApiFetch";
import BackButton from "../../BackButton";

function UsersList() {
  const apiFetch = useApiFetch();
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState(null);
  const [resMessage, setResMessage] = useState(null);

  useEffect(() => {
    async function getUsers() {
      try {
        const { responseObject } = await apiFetch("GET", "admin/users");
        if (responseObject?.data) {
          setUsers(responseObject.data);
        } else if (responseObject?.message) {
          setResMessage(responseObject.message);
        }
      } catch (err) {
        setResMessage("Failed to load users list");
      } finally {
        setLoading(false);
      }
    }
    getUsers();
  }, [apiFetch]);

  return (
    <div className="UsersList column">
      <h1>Users</h1>
      {loading ? (
        <h2>Loading...</h2>
      ) : users ? (
        <ul className="column">
          {users.map((user) => {
            return (
              <li key={user._id}>
                <h2>{user.username}</h2>
                <p>{user.active ? "Active" : "Inactive"}</p>
                <p>Roles: {user.roles.join(", ")}</p>
              </li>
            );
          })}
        </ul>
      ) : resMessage ? (
        <h2>{resMessage}</h2>
      ) : (
        <h2>Unable to load user notes</h2>
      )}
      <BackButton />
    </div>
  );
}

export default UsersList;
