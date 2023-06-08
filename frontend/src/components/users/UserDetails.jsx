import React from "react";
import { Link } from "react-router-dom";

function UserDetails() {
  function handleSubmit(event) {
    event.preventDefault();
  }
  return (
    <section className="users_usersList">
      <h1>User settings</h1>
      <form
        onSubmit={(event) => {
          handleSubmit(event);
        }}
      >
        <label htmlFor="username">New username: </label>
        <input type="text" id="username" />
        <label htmlFor="password">New password: </label>
        <input type="password" id="password" />
        <button>Send</button>
      </form>
      <Link to="/api">
        <button>Back</button>
      </Link>
    </section>
  );
}

export default UserDetails;
