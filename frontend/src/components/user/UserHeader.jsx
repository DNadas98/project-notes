import React from "react";

function PrivateHeader({ username }) {
  return (
    <header className="UserHeader">
      <h1>Welcome {username}!</h1>
    </header>
  );
}

export default PrivateHeader;
