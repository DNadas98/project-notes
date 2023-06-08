import React, { useState } from "react";
import { Link } from "react-router-dom";

function Login() {
  const [successful, setSuccessful] = useState(false);
  const [resultMessage, setResultMessage] = useState(null);
  const [username, setUsername] = useState(null);
  const [password, setPassword] = useState(null);

  async function handleSubmit(event) {
    try {
      event.preventDefault();
      if (!username || !password) {
        setResultMessage("All fields are required");
        return;
      }
      const valid = true;
      if (valid) {
        const url = "http://127.0.0.1:3001/auth/login";
        const reqBody = JSON.stringify({ "username": username, "password": password });
        const httpResponse = await fetch(url, {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: reqBody
        });
        const responseObject = await httpResponse.json();
        if (httpResponse?.status === 200 /*&& responseObject?.accessToken*/) {
          setResultMessage("Login successful");
          //const
          setSuccessful(true);
        } else if (responseObject?.message) {
          setResultMessage(responseObject.message);
        }
      }
    } catch (err) {
      setResultMessage("Error");
    }
  }

  return (
    <section className="auth_login">
      <h1>Login</h1>
      {resultMessage ? <p>{resultMessage}</p> : <p>Please enter your name and password to log in</p>}
      {successful ? (
        <Link to="/api">
          <button>Api</button>
        </Link>
      ) : (
        <form
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
    </section>
  );
}

export default Login;
