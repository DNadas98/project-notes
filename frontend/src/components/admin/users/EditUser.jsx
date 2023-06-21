import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import useApiFetch from "../../../hooks/useApiFetch";
import UserForm from "./UserForm";
import ConfirmBackButton from "../../ConfirmBackButton";

function EditUser() {
  const [loading, setLoading] = useState(true);
  const userid = useLocation()?.state?.userid;
  const [user, setUser] = useState(null);
  const [message, setMessage] = useState("Click save to update user settings");
  const apiFetch = useApiFetch();

  useEffect(() => {
    async function getUserById() {
      try {
        const encodedId = encodeURI(userid);
        const { responseObject } = await apiFetch("GET", `admin/users/${encodedId}`);
        if (responseObject?.data) {
          setUser(responseObject.data);
        } else {
          setUser(null);
        }
      } catch (err) {
        setUser(null);
      } finally {
        setLoading(false);
      }
    }
    getUserById();
  }, [userid, apiFetch]);

  async function handleSubmit(event) {
    event.preventDefault();
    try {
      const { responseObject } = await apiFetch("PATCH", "admin/users", {
        "userid": userid,
        "roles": user.roles,
        "active": user.active ? true : false
      });
      if (responseObject?.message) {
        setMessage(responseObject.message);
      } else {
        setMessage("Failed to update note");
      }
    } catch (err) {
      setMessage("Failed to update note");
    }
  }

  return loading ? (
    <h1>Loading...</h1>
  ) : (
    <div className="column">
      {user ? (
        <UserForm message={message} handleSubmit={handleSubmit} user={user} setUser={setUser} />
      ) : (
        <h1>User not found</h1>
      )}
      <ConfirmBackButton />
    </div>
  );
}

export default EditUser;
