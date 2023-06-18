import React, { useRef, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import useApiFetch from "../../hooks/useApiFetch";
import BackButton from "../BackButton";
import LoadingSpinner from "../LoadingSpinner";
import Confirm from "../Confirm";

function Register() {
  const location = useLocation();
  const apiFetch = useApiFetch();
  const [loading, setLoading] = useState(false);
  const [successful, setSuccessful] = useState(false);
  const [resultMessage, setResultMessage] = useState(null);
  const usernameRef = useRef();
  const passwordRef = useRef();
  const confirmPasswordRef = useRef();
  const [showConfirm, setShowConfirm] = useState(false);
  const [confirmText, setConfirmText] = useState("");
  const [onConfirm, setOnConfirm] = useState(null);

  async function handleSubmit(event) {
    try {
      event.preventDefault();
      const username = usernameRef.current.value;
      const password = passwordRef.current.value;
      const confirmPassword = confirmPasswordRef.current.value;
      let validInput = true;
      if (!username || !password || !confirmPassword) {
        setResultMessage("All fields are required");
        validInput = false;
      }
      if (password !== confirmPassword) {
        setResultMessage("Passwords don't match");
        validInput = false;
      }
      if (validInput) {
        setConfirmText(`Create user account "${username}"?\nYou will be redirected to login`);
        setOnConfirm(() => fetchRegister);
        setShowConfirm(true);
      }
    } catch (err) {
      setResultMessage("Failed to create user");
    }
  }

  async function fetchRegister() {
    try {
      setLoading(true);
      const { httpResponse, responseObject } = await apiFetch("POST", "user", {
        "username": usernameRef.current.value,
        "password": passwordRef.current.value
      });
      setResultMessage(responseObject.message);
      if (httpResponse.status === 201) {
        setSuccessful(true);
      }
    } catch (err) {
      setResultMessage("Failed to create user");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="Register column">
      <Confirm
        showConfirm={showConfirm}
        setShowConfirm={setShowConfirm}
        confirmText={confirmText}
        onConfirm={onConfirm}
        setOnConfirm={setOnConfirm}
      />
      <h1>Register</h1>
      {resultMessage ? <p>{resultMessage}</p> : <p>Please enter your name and password to register</p>}
      {loading ? (
        <LoadingSpinner />
      ) : successful ? (
        <Navigate to="/login" state={{ from: location }} replace />
      ) : (
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
          <button>Register</button>
        </form>
      )}
      <BackButton />
    </div>
  );
}

export default Register;
