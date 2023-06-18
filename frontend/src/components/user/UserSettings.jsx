import React, { useRef, useState } from "react";
import useApiFetch from "../../hooks/useApiFetch";
import useLogout from "../../hooks/auth/useLogout";
import ConfirmBackButton from "../ConfirmBackButton";
import Confirm from "../Confirm";
import LoadingSpinner from "../LoadingSpinner";

function UserSettings() {
  const apiFetch = useApiFetch();
  const logout = useLogout();
  const [resultMessage, setResultMessage] = useState(null);
  const usernameRef = useRef();
  const passwordRef = useRef();
  const confirmPasswordRef = useRef();
  const [showConfirm, setShowConfirm] = useState(false);
  const [confirmText, setConfirmText] = useState("");
  const [onConfirm, setOnConfirm] = useState(null);
  const [loading, setLoading] = useState(false);

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
        setConfirmText("Are you sure you want to update your user settings?\nYou will be required to log in again.");
        setOnConfirm(() => fetchUpdate);
        setShowConfirm(true);
      }
    } catch (err) {
      setResultMessage("Failed to update settings");
    }
  }

  async function fetchUpdate() {
    try {
      setLoading(true);
      const username = usernameRef.current.value;
      const password = passwordRef.current.value;
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
      } else if (responseObject?.message) {
        setResultMessage(responseObject.message);
      } else {
        setResultMessage("Failed to update settings");
      }
    } catch (err) {
      setResultMessage("Failed to update settings");
    } finally {
      setOnConfirm(null);
      setLoading(false);
    }
  }

  async function fetchDelete() {
    try {
      setLoading(true);
      const { httpResponse, responseObject } = await apiFetch("DELETE", "user");
      if (httpResponse.status === 200 && responseObject?.message) {
        await logout();
      } else if (responseObject?.message) {
        setResultMessage(responseObject.message);
      } else {
        setResultMessage("Failed to delete account");
      }
    } catch (err) {
      setResultMessage("Failed to delete account");
    } finally {
      setOnConfirm(null);
      setLoading(false);
    }
  }

  return loading ? (
    <LoadingSpinner />
  ) : (
    <div className="UserSettings column">
      <Confirm
        showConfirm={showConfirm}
        setShowConfirm={setShowConfirm}
        confirmText={confirmText}
        onConfirm={onConfirm}
      />
      <h1>User settings</h1>
      {resultMessage ? <h3 className="red">{resultMessage}</h3> : <h3>Please enter your data to update</h3>}
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
        <button>Save</button>
      </form>
      <button
        onClick={() => {
          setConfirmText("Are you sure you want to delete your account?\nThis action is irreversible.");
          setOnConfirm(() => fetchDelete);
          setShowConfirm(true);
        }}
      >
        Delete account
      </button>
      <ConfirmBackButton />
    </div>
  );
}

export default UserSettings;
