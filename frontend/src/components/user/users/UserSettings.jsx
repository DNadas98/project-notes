import React, { useState } from "react";
import useApiFetch from "../../../hooks/useApiFetch";
import useLogout from "../../../hooks/useLogout";
import BackButton from "../../BackButton";

function UserSettings() {
  const apiFetch = useApiFetch();
  const logout = useLogout();
  const [resultMessage, setResultMessage] = useState(null);
  const [username, setUsername] = useState(null);
  const [password, setPassword] = useState(null);
  const [confirmPassword, setConfirmPassword] = useState(null);
  async function handleSubmit(event) {
    try {
      event.preventDefault();
      let validInput = true;
      if (!username && !password) {
        setResultMessage("Nothing to update");
        validInput = false;
      }
      if (password !== confirmPassword) {
        setResultMessage("Passwords don't match");
        validInput = false;
      }
      if (validInput) {
        let requestBody = {};
        if (username) {
          requestBody.newUsername = username;
        }
        if (password) {
          requestBody.newPassword = password;
        }
        const { httpResponse, responseObject } = await apiFetch("PATCH", "user", requestBody);
        if (httpResponse.status === 200 && responseObject?.message) {
          await logout();
        }
        if (responseObject?.message) {
          setResultMessage(responseObject.message);
        }
      }
    } catch (err) {
      setResultMessage("Failed to update settings");
    }
  }
  return (
    <div className="UserSettings column">
      <h1>User settings</h1>
      {resultMessage ? <p>{resultMessage}</p> : <p>Please enter your data to update</p>}
      <form
        className="column"
        onSubmit={(event) => {
          handleSubmit(event);
        }}
      >
        <label htmlFor="username">New username: </label>
        <input
          type="text"
          id="username"
          onChange={(event) => {
            setUsername(event.target.value);
          }}
        />
        <label htmlFor="password">New password: </label>
        <input
          type="password"
          id="password"
          onChange={(event) => {
            setPassword(event.target.value);
          }}
        />
        <label htmlFor="confirm_password">Confirm password:</label>
        <input
          type="password"
          id="confirm_password"
          onChange={(event) => {
            setConfirmPassword(event.target.value);
          }}
        />
        <button>Send</button>
      </form>
      <BackButton />
    </div>
  );
}

export default UserSettings;
