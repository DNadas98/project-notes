import React from "react";
import { Link } from "react-router-dom";

function UserDetails() {
  function handleSubmit(event) {
    event.preventDefault();
  }
  return (
    <div className="UserDetails column">
      <h1>User settings</h1>
      <form
        className="column"
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
    </div>
  );
}

export default UserDetails;
