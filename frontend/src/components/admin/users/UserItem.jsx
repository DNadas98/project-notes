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
    <tr>
      <td className="hiddenCell">
        <Confirm
          showConfirm={showConfirm}
          setShowConfirm={setShowConfirm}
          confirmText={confirmText}
          onConfirm={onConfirm}
        />
      </td>
      <td className="username">
        <h2>{user.username}</h2>
      </td>
      <td>
        <table>
          <tbody>
            <tr>
              <td>Status:</td>
              <td>{user.active ? <span className="green">Active</span> : <span className="red">Inactive</span>}</td>
            </tr>
            <tr>
              <td>Roles:</td>
              <td>{user.roles.join(", ")}</td>
            </tr>
          </tbody>
        </table>
      </td>
      <td>
        <Link to="notes" state={{ "user": user }}>
          <button className="smallButton">
            <h1>🗎</h1>
          </button>
        </Link>
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
  );
}

export default UserItem;
