import React, { useState, useContext } from "react";
import { Link } from "react-router-dom";
import AuthContext from "../../context/AuthProvider";

function Login() {
  const { setAuth } = useContext(AuthContext);
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
        const apiUrl = "http://127.0.0.1:3501/api"; //process.env.REACT_APP_API_URL;
        const url = `${apiUrl}/auth/login`;
        const reqBody = JSON.stringify({ "username": username, "password": password });
        const httpResponse = await fetch(url, {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          credentials: "include" /* include cookies and auth header */,
          body: reqBody
        });
        const responseObject = await httpResponse.json();
        const accessToken = responseObject?.accessToken;
        console.log(httpResponse);
        console.log(responseObject);
        if (httpResponse?.status === 200 && accessToken) {
          setResultMessage("Login successful");
          setAuth(username, password, accessToken);
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
        <Link to="/api">
          <button>Api</button>
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
