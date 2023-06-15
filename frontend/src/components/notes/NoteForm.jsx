import React from "react";

function NoteForm({ message, handleSubmit, note, setNote }) {
  return (
    <div className="NoteForm">
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
          placeholder="Note title"
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
          placeholder="Note text"
          onChange={(event) => {
            setNote({ ...note, text: event.target.value });
          }}
        />
        <button>Save</button>
      </form>
    </div>
  );
}

export default NoteForm;
