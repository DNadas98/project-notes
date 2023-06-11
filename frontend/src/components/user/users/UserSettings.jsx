import React from "react";
import { Link } from "react-router-dom";

function UserSettings() {
  function handleSubmit(event) {
    event.preventDefault();
  }
  return (
    <div className="UserSettings column">
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
      <Link to="/user">
        <button>Back</button>
      </Link>
    </div>
  );
}

export default UserSettings;
