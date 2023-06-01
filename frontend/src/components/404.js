import React from "react";
import { Link } from "react-router-dom";

function NotFound() {
  return (
    <section className="error_404">
      <h1>404 - Not Found</h1>
      <Link to="/">
        <button>Home</button>
      </Link>
    </section>
  );
}

export default NotFound;
