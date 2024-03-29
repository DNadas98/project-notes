import React from "react";
import { Link } from "react-router-dom";

function AdminItem({ admin }) {
  return (
    <tr>
      <td className="username">
        <h2>{admin.username}</h2>
      </td>
      <td>
        <table>
          <tbody>
            <tr>
              <td>Status:</td>
              <td>{admin.active ? <span className="green">Active</span> : <span className="red">Inactive</span>}</td>
            </tr>
          </tbody>
        </table>
      </td>
      <td>
        <Link to="notes" state={{ "user": admin }}>
          <button className="smallButton">
            <h1>🗎</h1>
          </button>
        </Link>
      </td>
    </tr>
  );
}

export default AdminItem;
