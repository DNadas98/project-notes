import React, { useState } from "react";
import useApiFetch from "../../../hooks/useApiFetch";
import Confirm from "../../Confirm";
import { Link } from "react-router-dom";

function UserItem({ user, getUsers }) {
  const apiFetch = useApiFetch();
  const [showConfirm, setShowConfirm] = useState(false);
  const [confirmText, setConfirmText] = useState("");
  const [onConfirm, setOnConfirm] = useState(null);

  async function handleDelete() {
    try {
      const { httpResponse, responseObject } = await apiFetch("DELETE", "admin/users", { "userid": user._id });
      if (httpResponse?.status === 200 && responseObject?.message) {
        await getUsers();
      }
    } catch (err) {
    } finally {
      setOnConfirm(null);
    }
  }

  return (
    <tr className="UserItem">
      <Confirm
        showConfirm={showConfirm}
        setShowConfirm={setShowConfirm}
        confirmText={confirmText}
        onConfirm={onConfirm}
      />
      <tr>
        <td>
          <h2>{user.username}</h2>
        </td>
        <td>
          <Link to="edit" state={{ "userid": user._id }}>
            <button className="smallButton">✏️</button>
          </Link>
        </td>
        <td>
          <button
            className="smallButton"
            onClick={() => {
              setConfirmText(`Are you sure you want to delete "${user.username}"?`);
              setOnConfirm(() => handleDelete);
              setShowConfirm(true);
            }}
          >
            <h2>X</h2>
          </button>
        </td>
      </tr>
      <tr>
        <td>{user.active ? <p className="green">Active</p> : <p className="red">Inactive</p>}</td>
      </tr>
      <tr>
        <td>
          <p>Roles: {user.roles.join(", ")}</p>
        </td>
      </tr>
    </tr>
  );
}

export default UserItem;
