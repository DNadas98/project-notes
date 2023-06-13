import React, { useRef, useState } from "react";
import { Link, Navigate, useLocation } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import useApiFetch from "../../hooks/useApiFetch";

function Login() {
  const location = useLocation();
  const { setAuth } = useAuth();
  const apiFetch = useApiFetch();
  const [successful, setSuccessful] = useState(false);
  const [resultMessage, setResultMessage] = useState(null);
  const usernameRef = useRef();
  const passwordRef = useRef();

  async function handleSubmit(event) {
    try {
      event.preventDefault();
      const username = usernameRef.current.value;
      const password = passwordRef.current.value;
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
        const receivedUsername = responseObject?.username;
        const receivedRoles = responseObject?.roles;
        if (httpResponse?.status === 200 && accessToken && receivedUsername && receivedRoles) {
          setAuth({ "username": receivedUsername, "roles": receivedRoles, "accessToken": accessToken });
          setSuccessful(true);
        } else if (responseObject?.message) {
          setResultMessage(responseObject.message);
        } else {
          throw new Error("");
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
          <input type="text" id="username" ref={usernameRef} />
          <label htmlFor="password">Password:</label>
          <input type="password" id="password" ref={passwordRef} />
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
