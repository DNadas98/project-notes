import React, { useState } from "react";
import BackButton from "../BackButton";
import useApiFetch from "../../hooks/useApiFetch";
import NoteForm from "./NoteForm";

function CreateNote() {
  const [note, setNote] = useState({ "title": "", "text": "", "completed": false });
  const [message, setMessage] = useState("Create new note");
  const apiFetch = useApiFetch();

  async function handleSubmit(event) {
    event.preventDefault();
    try {
      const { responseObject } = await apiFetch("POST", "notes", {
        "title": note.title,
        "text": note.text,
        "completed": note.completed ? true : false
      });
      if (responseObject?.message) {
        setNote(responseObject.message);
      } else {
        setNote(null);
        setMessage("Failed to create note");
      }
    } catch (err) {
      setNote(null);
      setMessage("Failed to create note");
    }
  }

  return (
    <div className="column">
      <NoteForm message={message} handleSubmit={handleSubmit} note={note} setNote={setNote} />
      <BackButton />
    </div>
  );
}

export default CreateNote;
