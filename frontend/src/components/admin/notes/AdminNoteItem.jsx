import { format } from "date-fns";
import React, { useState } from "react";
import { ReactMarkdown } from "react-markdown/lib/react-markdown";
import { Link } from "react-router-dom";
import remarkGfm from "remark-gfm";

function AdminNoteItem({ note, user, setConfirmText, setOnConfirm, handleDelete, setShowConfirm }) {
  const [showDetails, setShowDetails] = useState(false);
  return (
    <li className="UserNoteItem column">
      <div className="noteItem row">
        <div className="noteTitle row">
          {note.completed ? <h2 className="through">{note.title}</h2> : <h2>{note.title}</h2>}
          {note.completed && <h2 className="green"> ✔</h2>}
        </div>
        <div className="noteButtons row">
          <button
            className="smallButton"
            onClick={() => {
              setShowDetails(!showDetails);
            }}
          >
            <h2>{showDetails ? "▲" : "▼"}</h2>
          </button>
          {user && (
            <Link to="edit" state={{ "noteid": note._id, "userid": user._id }}>
              <button className="smallButton">
                <h2>✏️</h2>
              </button>
            </Link>
          )}
          <button
            className="smallButton"
            onClick={() => {
              setConfirmText(`Are you sure you want to delete "${note.title}"?`);
              setOnConfirm(() => () => {
                handleDelete(note._id);
              });
              setShowConfirm(true);
            }}
          >
            <h2>X</h2>
          </button>
        </div>
      </div>
      {showDetails && (
        <div className="noteDetails column">
          <h3>{format(new Date(note.createdAt), "yyyy.MM.dd HH:mm")}</h3>
          <h3>{note.completed ? "Completed" : "Not completed yet"}</h3>
          <ReactMarkdown className="noteText" children={note.text} remarkPlugins={[remarkGfm]}></ReactMarkdown>
        </div>
      )}
    </li>
  );
}

export default AdminNoteItem;
