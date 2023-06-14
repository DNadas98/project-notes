import React from "react";

function Footer({ pageTitle, name }) {
  const year = new Date().getFullYear();
  return (
    <footer>
      <h2 className="inline">
        {pageTitle} | {year} ©{" "}
        <a rel="noreferrer" target="_blank" href="https://github.com/DNadas98">
          {name}
        </a>
      </h2>
    </footer>
  );
}

export default Footer;
