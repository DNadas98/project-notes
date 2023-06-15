import React, { useState } from "react";
import { Link } from "react-router-dom";
import useApiFetch from "../../hooks/useApiFetch";

function UserNoteItem({ note, getUserNotes }) {
  const [showText, setShowText] = useState(false);
  const apiFetch = useApiFetch();
  async function handleDelete() {
    console.log(note);
    await apiFetch("DELETE", "notes", { "_id": note._id });
    await getUserNotes();
  }
  return (
    <li className="UserNoteItem">
      <div className="row">
        <button
          onClick={() => {
            setShowText(!showText);
          }}
        >
          <h2>{note.title}</h2>
        </button>
        <Link to="edit" state={{ "noteid": note._id }}>
          <button className="smallButton">✏️</button>
        </Link>
        <button className="smallButton" onClick={handleDelete}>
          X
        </button>
      </div>
      {showText && <p className="noteText">{note.text}</p>}
    </li>
  );
}

export default UserNoteItem;
