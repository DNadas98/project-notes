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
    <section className="notes_notesList">
      <h1>User notes</h1>
      <ul>
        {example.map((note) => {
          return (
            <li key={note.id}>
              <h1>Title: {note.title}</h1>
              <h1>Text:</h1>
              <p>{note.text}</p>
            </li>
          );
        })}
      </ul>
      <Link to="/api">
        <button>Back</button>
      </Link>
    </section>
  );
}

export default NotesList;
