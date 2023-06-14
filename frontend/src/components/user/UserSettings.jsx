import React, { useRef, useState } from "react";
import useApiFetch from "../../hooks/useApiFetch";
import useLogout from "../../hooks/auth/useLogout";
import BackButton from "../BackButton";

function UserSettings() {
  const apiFetch = useApiFetch();
  const logout = useLogout();
  const [resultMessage, setResultMessage] = useState(null);
  const usernameRef = useRef();
  const passwordRef = useRef();
  const confirmPasswordRef = useRef();
  async function handleSubmit(event) {
    try {
      event.preventDefault();
      const username = usernameRef.current.value;
      const password = passwordRef.current.value;
      const confirmPassword = confirmPasswordRef.current.value;
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
        <label htmlFor="username">Username:</label>
        <input type="text" id="username" ref={usernameRef} />
        <label htmlFor="password">Password:</label>
        <input type="password" id="password" ref={passwordRef} />
        <label htmlFor="confirm_password">Confirm password:</label>
        <input type="password" id="confirm_password" ref={confirmPasswordRef} />
        <button>Send</button>
      </form>
      <BackButton />
    </div>
  );
}

export default UserSettings;
