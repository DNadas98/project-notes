import React, { useState } from "react";
import { Link, Navigate, useLocation } from "react-router-dom";
import useApiFetch from "../../hooks/useApiFetch";

function Register() {
  const apiFetch = useApiFetch();
  const [successful, setSuccessful] = useState(false);
  const [resultMessage, setResultMessage] = useState(null);
  const location = useLocation();

  async function handleSubmit(event) {
    try {
      event.preventDefault();
      const username = event.target[0].value;
      const password = event.target[1].value;
      const confirmPassword = event.target[2].value;
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
        const { httpResponse, responseObject } = await apiFetch("POST", "users", {
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
          <input type="text" id="username" />
          <label htmlFor="password">Password:</label>
          <input type="password" id="password" />
          <label htmlFor="confirm_password">Confirm password:</label>
          <input type="password" id="confirm_password" />
          <button>Register</button>
        </form>
      )}
      <Link to="/">
        <button>Back</button>
      </Link>
    </div>
  );
}

export default Register;
