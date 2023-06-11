import React, { useState } from "react";
import { Link } from "react-router-dom";

function Register() {
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
        const url = "http://127.0.0.1:3001/users";
        const reqBody = JSON.stringify({ "username": username, "password": password });
        const httpResponse = await fetch(url, {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: reqBody
        });
        const responseObject = await httpResponse.json();
        setResultMessage(responseObject.message);
        if (httpResponse.status === 201) {
          setSuccessful(true);
        }
      }
    } catch (err) {
      setResultMessage("Error");
    }
  }

  return (
    <div className="Register column">
      <h1>Register</h1>
      {resultMessage ? <p>{resultMessage}</p> : <p>Please enter your name and password to register</p>}
      {successful ? (
        <Link to="/login">
          <button>Login</button>
        </Link>
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
