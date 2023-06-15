import React, { useEffect, useState } from "react";
import BackButton from "../BackButton";
import { useLocation } from "react-router-dom";
import useApiFetch from "../../hooks/useApiFetch";

function EditNote() {
  const [loading, setLoading] = useState(true);
  const noteid = useLocation().state.noteid;
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
    //_id, title, text, completed
    const { responseObject } = await apiFetch("PATCH", "notes", {
      "_id": note._id,
      "title": note.title,
      "text": note.text ? note.text : null,
      "completed": note.completed ? true : false
    });
    if (responseObject?.message) {
      setMessage(responseObject.message);
    } else {
      setMessage("Failed to update note");
    }
  }

  return loading ? (
    <h1>Loading...</h1>
  ) : note ? (
    <div className="editNote column">
      <h2>{message}</h2>
      <form
        className="column"
        onSubmit={(event) => {
          handleSubmit(event);
        }}
      >
        <input
          type="text"
          maxLength="20"
          id="title"
          value={note.title}
          onChange={(event) => {
            setNote({ ...note, title: event.target.value });
          }}
        />
        <div className="row">
          <label htmlFor="completed">Completed:</label>
          <input
            type="checkbox"
            id="completed"
            checked={note.completed}
            onChange={() => {
              setNote({ ...note, completed: !note.completed });
            }}
          />
        </div>
        <textarea
          id="text"
          rows="15"
          className="noteTextInput"
          value={note.text ? note.text : ""}
          onChange={(event) => {
            setNote({ ...note, text: event.target.value });
          }}
        />
        <button>Save</button>
      </form>
      <BackButton />
    </div>
  ) : (
    <h1>Note not found</h1>
  );
}

export default EditNote;
