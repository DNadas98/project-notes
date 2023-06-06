import React from "react";
import { Link } from "react-router-dom";

function Register() {
  return (
    <section className="auth_register">
      <h1>Register</h1>
      <Link to="/login">
        <button>Login</button>
      </Link>
      <Link to="/">
        <button>Back</button>
      </Link>
    </section>
  );
}

export default Register;
