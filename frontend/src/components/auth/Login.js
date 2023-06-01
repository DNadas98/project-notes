import React from "react";
import { Link } from "react-router-dom";
function Login() {
  return (
    <section className="auth_login">
      <h1>Login</h1>
      <Link to="/api">
        <button>API</button>
      </Link>
      <Link to="/">
        <button>Back</button>
      </Link>
    </section>
  );
}

export default Login;
