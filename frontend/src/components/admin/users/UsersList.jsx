import React, { useEffect, useState } from "react";
import useApiFetch from "../../../hooks/useApiFetch";
import BackButton from "../../BackButton";
import UserItem from "./UserItem";
import AdminItem from "./AdminItem";
import LoadingSpinner from "../../LoadingSpinner";
import Confirm from "../../Confirm";

function UsersList() {
  const apiFetch = useApiFetch();
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState(null);
  const [resMessage, setResMessage] = useState(null);
  const [filteredUsers, setFilteredUsers] = useState(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [confirmText, setConfirmText] = useState("");
  const [onConfirm, setOnConfirm] = useState(null);

  async function getUsers() {
    try {
      const { responseObject } = await apiFetch("GET", "admin/users");
      if (responseObject?.data) {
        const sortedUsers = responseObject.data.sort((a, b) => a.username.localeCompare(b.username));
        setUsers(sortedUsers);
        setFilteredUsers(sortedUsers);
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [apiFetch]);

  async function handleDelete(userid) {
    try {
      setLoading(true);
      const { httpResponse, responseObject } = await apiFetch("DELETE", "admin/users", { "userid": userid });
      if (httpResponse?.status === 200 && responseObject?.message) {
        await getUsers();
      }
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  }

  function handleSearch(searchValue) {
    setFilteredUsers(users.filter((user) => user.username.toLowerCase().includes(searchValue.toLowerCase())));
  }
  return (
    <div className="column">
      <Confirm
        showConfirm={showConfirm}
        setShowConfirm={setShowConfirm}
        confirmText={confirmText}
        onConfirm={onConfirm}
        setOnConfirm={setOnConfirm}
      />
      <input
        type="text"
        placeholder="Search users"
        onInput={(event) => {
          handleSearch(event.target.value);
        }}
      />
      {loading ? (
        <LoadingSpinner />
      ) : users ? (
        <div className="UsersList column">
          <table className="usersTable">
            <tbody>
              <tr>
                <th colSpan="5">
                  <h1>Users</h1>
                </th>
              </tr>
              {filteredUsers
                .filter((user) => !user.roles.includes("Editor") && !user.roles.includes("Admin"))
                .map((user) => {
                  return (
                    <UserItem
                      key={user._id}
                      user={user}
                      getUsers={getUsers}
                      handleDelete={handleDelete}
                      setConfirmText={setConfirmText}
                      setOnConfirm={setOnConfirm}
                      setShowConfirm={setShowConfirm}
                    />
                  );
                })}
              <tr>
                <th colSpan="5">
                  <h1>Editors</h1>
                </th>
              </tr>
              {filteredUsers
                .filter((user) => user.roles.includes("Editor") && !user.roles.includes("Admin"))
                .map((user) => {
                  return (
                    <UserItem
                      key={user._id}
                      user={user}
                      getUsers={getUsers}
                      handleDelete={handleDelete}
                      setConfirmText={setConfirmText}
                      setOnConfirm={setOnConfirm}
                      setShowConfirm={setShowConfirm}
                    />
                  );
                })}
              <tr>
                <th colSpan="5">
                  <h1>Admins</h1>
                </th>
              </tr>
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
