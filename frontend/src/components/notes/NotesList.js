import React from "react";
import { Link } from "react-router-dom";

function NotesList() {
  return (
    <section className="notes_notesList">
      <h1>Notes</h1>
      <Link to="/api">
        <button>Back</button>
      </Link>
    </section>
  );
}

export default NotesList;
