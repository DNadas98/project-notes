import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import useApiFetch from "../../hooks/useApiFetch";
import NoteForm from "./NoteForm";
import ConfirmBackButton from "../ConfirmBackButton";
import LoadingSpinner from "../LoadingSpinner";

function EditNote() {
  const [loading, setLoading] = useState(true);
  const noteid = useLocation()?.state?.noteid;
  const [note, setNote] = useState(null);
  const [message, setMessage] = useState("Click save to update note");
  const apiFetch = useApiFetch();

  useEffect(() => {
    async function getNoteById() {
      try {
        const encodedId = encodeURI(noteid);
        const { responseObject } = await apiFetch("GET", `notes/${encodedId}`);
        if (responseObject?.data) {
          setNote(responseObject.data);
        } else {
          setNote(null);
        }
      } catch (err) {
        setNote(null);
      } finally {
        setLoading(false);
      }
    }
    getNoteById();
  }, [noteid, apiFetch]);

  async function handleSubmit(event) {
    event.preventDefault();
    setLoading(true);
    try {
      const { responseObject } = await apiFetch("PATCH", "notes", {
        "_id": noteid,
        "title": note.title,
        "text": note.text ? note.text : null,
        "completed": note.completed ? true : false
      });
      if (responseObject?.message) {
        setMessage(responseObject.message);
      } else {
        setMessage("Failed to update note");
      }
    } catch (err) {
      setMessage("Failed to update note");
    } finally {
      setLoading(false);
    }
  }

  return loading ? (
    <LoadingSpinner />
  ) : (
    <div className="column">
      {note ? (
        <NoteForm message={message} handleSubmit={handleSubmit} note={note} setNote={setNote} />
      ) : (
        <h1>Note not found</h1>
      )}
      <ConfirmBackButton />
    </div>
  );
}

export default EditNote;
