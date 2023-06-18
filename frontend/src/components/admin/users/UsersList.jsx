import React, { useEffect, useState } from "react";
import useApiFetch from "../../../hooks/useApiFetch";
import BackButton from "../../BackButton";
import UserItem from "./UserItem";
import AdminItem from "./AdminItem";

function UsersList() {
  const apiFetch = useApiFetch();
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState(null);
  const [resMessage, setResMessage] = useState(null);
  const [filteredUsers, setFilteredUsers] = useState(null);

  async function getUsers() {
    try {
      const { responseObject } = await apiFetch("GET", "admin/users");
      if (responseObject?.data) {
        setUsers(responseObject.data);
        setFilteredUsers(responseObject.data);
      } else {
        setUsers(null);
        setFilteredUsers(null);
        responseObject?.message ? setResMessage(responseObject.message) : setResMessage("Failed to load users");
      }
    } catch (err) {
      setResMessage("Failed to load users");
    } finally {
      setLoading(false);
    }
  }
  useEffect(() => {
    getUsers();
  }, [apiFetch]);

  function handleSearch(searchValue) {
    setFilteredUsers(users.filter((user) => user.username.toLowerCase().includes(searchValue.toLowerCase())));
  }
  return (
    <div className="column">
      <input
        type="text"
        placeholder="Search users"
        onInput={(event) => {
          handleSearch(event.target.value);
        }}
      />
      {loading ? (
        <h2>Loading...</h2>
      ) : users ? (
        <div className="UsersList column">
          <h1>Users</h1>
          <table className="usersTable">
            <tbody>
              {filteredUsers
                .filter((user) => !user.roles.includes("Editor") && !user.roles.includes("Admin"))
                .map((user) => {
                  return <UserItem key={user._id} user={user} getUsers={getUsers} />;
                })}
            </tbody>
          </table>
          <h1>Editors</h1>
          <table className="usersTable">
            <tbody>
              {filteredUsers
                .filter((user) => user.roles.includes("Editor") && !user.roles.includes("Admin"))
                .map((user) => {
                  return <UserItem key={user._id} user={user} getUsers={getUsers} />;
                })}
            </tbody>
          </table>
          <h1>Admins</h1>
          <table className="adminsTable">
            <tbody>
              {filteredUsers
                .filter((user) => user.roles.includes("Admin"))
                .map((admin) => {
                  return <AdminItem key={admin._id} admin={admin} />;
                })}
            </tbody>
          </table>
        </div>
      ) : resMessage ? (
        <h2>{resMessage}</h2>
      ) : (
        <h2>Unable to load users</h2>
      )}
      <BackButton />
    </div>
  );
}

export default UsersList;
