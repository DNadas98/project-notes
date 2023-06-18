import React, { useState } from "react";
import useApiFetch from "../../hooks/useApiFetch";
import NoteForm from "./NoteForm";
import ConfirmBackButton from "../ConfirmBackButton";
import BackButton from "../BackButton";
import LoadingSpinner from "../LoadingSpinner";

function CreateNote() {
  const [note, setNote] = useState({ "title": "", "text": "", "completed": false });
  const [message, setMessage] = useState("Create new note");
  const [created, setCreated] = useState(false);
  const [loading, setLoading] = useState(false);
  const apiFetch = useApiFetch();

  async function handleSubmit(event) {
    event.preventDefault();
    setLoading(true);
    try {
      const { responseObject, httpResponse } = await apiFetch("POST", "notes", {
        "title": note.title,
        "text": note.text,
        "completed": note.completed ? true : false
      });
      if (responseObject?.message) {
        setMessage(responseObject.message);
        if (httpResponse.status === 201) {
          setCreated(true);
        }
      } else {
        setNote(null);
        setMessage("Failed to create note");
      }
    } catch (err) {
      setNote(null);
      setMessage("Failed to create note");
    } finally {
      setLoading(false);
    }
  }

  return loading ? (
    <LoadingSpinner />
  ) : (
    <div className="column">
      {created ? (
        <div className="column">
          <h2>{message}</h2>
          <BackButton />
        </div>
      ) : (
        <div className="column">
          <NoteForm message={message} handleSubmit={handleSubmit} note={note} setNote={setNote} />
          <ConfirmBackButton />
        </div>
      )}
    </div>
  );
}

export default CreateNote;
