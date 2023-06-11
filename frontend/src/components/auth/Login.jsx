import React, { useState } from "react";
import { Link, Navigate, useLocation } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import useApiFetch from "../../hooks/useApiFetch";

function Login() {
  const { setAuth } = useAuth();
  const apiFetch = useApiFetch();
  const [successful, setSuccessful] = useState(false);
  const [resultMessage, setResultMessage] = useState(null);
  const [username, setUsername] = useState(null);
  const [password, setPassword] = useState(null);
  const location = useLocation();

  async function handleSubmit(event) {
    try {
      event.preventDefault();
      if (!username || !password) {
        setResultMessage("All fields are required");
        return;
      }
      const valid = true;
      if (valid) {
        const { httpResponse, responseObject } = await apiFetch("POST", "auth/login", {
          "username": username,
          "password": password
        });
        const accessToken = responseObject?.accessToken;
        if (httpResponse?.status === 200 && accessToken) {
          setAuth({ "username": username, "accessToken": accessToken });
          setSuccessful(true);
        } else if (responseObject?.message) {
          setResultMessage(responseObject.message);
        }
      }
    } catch (err) {
      setResultMessage("Login failed");
    }
  }

  return (
    <div className="Login column">
      <h1>Login</h1>
      {resultMessage ? <p>{resultMessage}</p> : <p>Please enter your name and password to log in</p>}
      {successful ? (
        <Navigate to="/user" state={{ from: location }} />
      ) : (
        <form
          className="column"
          onSubmit={(event) => {
            handleSubmit(event);
          }}
        >
          <label htmlFor="username">Username:</label>
          <input
            type="text"
            id="username"
            onChange={(event) => {
              setUsername(event.target.value);
            }}
          />
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            onChange={(event) => {
              setPassword(event.target.value);
            }}
          />
          <button>Login</button>
        </form>
      )}
      <Link to="/">
        <button>Back</button>
      </Link>
    </div>
  );
}

export default Login;
