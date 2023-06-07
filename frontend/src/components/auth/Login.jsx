import React, { useContext } from "react";
import { Link } from "react-router-dom";
import AuthContext from "../../context/AuthProvider";
function Login() {
  const { setAuth } = useContext(AuthContext); //success: setAuth
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
