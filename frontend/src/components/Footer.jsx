import React from "react";

function Footer({ pageTitle, name }) {
  const year = new Date().getFullYear();
  return (
    <footer className="public_footer">
      <h1 className="inline">
        {pageTitle} | {year} ©{" "}
        <a rel="noreferrer" target="_blank" href="https://github.com/DNadas98">
          {name}
        </a>
      </h1>
    </footer>
  );
}

export default Footer;
