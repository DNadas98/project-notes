import React from "react";
import { Link } from "react-router-dom";

function NotesList() {
  const example = [
    { "id": "1", "title": "asd", "text": "asd" },
    { "id": "2", "title": "asdfg", "text": "asdfg" },
    { "id": "3", "title": "asdfgh", "text": "asdfgh" },
    { "id": "4", "title": "asdfghj", "text": "asdfghj" }
  ];

  return (
    <div className="NotesList column">
      <h1>User notes</h1>
      <ul className="column">
        {example.map((note) => {
          return (
            <li key={note.id}>
              <h1>{note.title}</h1>
              <p>{note.text}</p>
            </li>
          );
        })}
      </ul>
      <Link to="/api">
        <button>Back</button>
      </Link>
    </div>
  );
}

export default NotesList;
