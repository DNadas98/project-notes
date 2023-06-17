import React from "react";

function UserForm({ message, handleSubmit, user, setUser }) {
  function toggleRole(roleToToggle) {
    if (user.roles.includes(roleToToggle)) {
      setUser({ ...user, roles: user.roles.filter((role) => role !== `${roleToToggle}`) });
    } else {
      setUser({ ...user, roles: [...user.roles, roleToToggle] });
    }
  }
  return (
    <div className="UserForm column">
      <h2>{message}</h2>
      <form
        className="column"
        onSubmit={(event) => {
          handleSubmit(event);
        }}
      >
        <h2>Status:</h2>
        <div className="row">
          <label htmlFor="active">Active:</label>
          <input
            type="checkbox"
            id="active"
            checked={user.active}
            onChange={() => {
              setUser({ ...user, active: !user.active });
            }}
          />
        </div>
        <h2>Roles:</h2>
        <div className="row">
          <label htmlFor="active">Editor:</label>
          <input
            type="checkbox"
            id="active"
            checked={user.roles.includes("Editor")}
            onChange={() => {
              toggleRole("Editor");
            }}
          />
        </div>
        <div className="row">
          <label htmlFor="active">Admin:</label>
          <input
            type="checkbox"
            id="active"
            checked={user.roles.includes("Admin")}
            onChange={() => {
              toggleRole("Admin");
            }}
          />
        </div>
        <button>Save</button>
      </form>
    </div>
  );
}

export default UserForm;
