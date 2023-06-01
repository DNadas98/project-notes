import React from "react";
import { Link } from "react-router-dom";

function UsersList() {
  return (
    <section className="users_usersList">
      <h1>Users</h1>
      <Link to="/api">
        <button>Back</button>
      </Link>
    </section>
  );
}

export default UsersList;
