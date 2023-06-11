import React, { useState } from "react";
import { Link } from "react-router-dom";

function Register() {
  const [successful, setSuccessful] = useState(false);
  const [resultMessage, setResultMessage] = useState(null);

  async function handleSubmit(event) {
    try {
      event.preventDefault();
      const username = event.target[0].value;
      const password = event.target[1].value;
      const confirmPassword = event.target[2].value;
      console.log(username, password, confirmPassword);
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
        const apiUrl = "http://127.0.0.1:3501/api"; /*process.env.REACT_APP_API_URL;*/
        const url = `${apiUrl}/users`;
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
