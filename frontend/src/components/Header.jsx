import React from "react";

function Header({ pageTitle }) {
  return (
    <header className="public_header">
      <h1>Welcome to {pageTitle}!</h1>
    </header>
  );
}

export default Header;
