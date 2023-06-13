import React, { useRef, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import useApiFetch from "../../hooks/useApiFetch";
import BackButton from "../BackButton";

function Register() {
  const location = useLocation();
  const apiFetch = useApiFetch();
  const [successful, setSuccessful] = useState(false);
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
      if (!username || !password || !confirmPassword) {
        setResultMessage("All fields are required");
        validInput = false;
      }
      if (password !== confirmPassword) {
        setResultMessage("Passwords don't match");
        validInput = false;
      }
      if (validInput) {
        const { httpResponse, responseObject } = await apiFetch("POST", "user", {
          "username": username,
          "password": password
        });
        setResultMessage(responseObject.message);
        if (httpResponse.status === 201) {
          setSuccessful(true);
        }
      }
    } catch (err) {
      setResultMessage("Failed to create user");
    }
  }

  return (
    <div className="Register column">
      <h1>Register</h1>
      {resultMessage ? <p>{resultMessage}</p> : <p>Please enter your name and password to register</p>}
      {successful ? (
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
