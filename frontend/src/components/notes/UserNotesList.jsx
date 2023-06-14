import React, { useEffect, useState } from "react";
import useApiFetch from "../../hooks/useApiFetch";
import BackButton from "../BackButton";

function UserNotesList() {
  const apiFetch = useApiFetch();
  const [loading, setLoading] = useState(true);
  const [userNotes, setUserNotes] = useState(null);
  const [resMessage, setResMessage] = useState(null);

  useEffect(() => {
    async function getUserNotes() {
      try {
        const { responseObject } = await apiFetch("GET", "notes");
        if (responseObject?.data) {
          setUserNotes(responseObject.data);
        } else if (responseObject?.message) {
          setResMessage(responseObject.message);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    getUserNotes();
  }, [apiFetch]);

  return (
    <div className="UserNotesList column">
      <h1>User notes</h1>
      {loading ? (
        <h2>Loading...</h2>
      ) : userNotes ? (
        <ul className="column">
          {userNotes
            .sort((a, b) => a.title.localeCompare(b.title))
            .map((note) => {
              return (
                <li key={note._id}>
                  <h2>{note.title}</h2>
                  <div className="row">
                    <button>Edit</button>
                    <button>Delete</button>
                  </div>
                  <h3>{note.completed ? "Completed" : "Not completed yet"}</h3>
                  <p>{note.text}</p>
                </li>
              );
            })}
        </ul>
      ) : resMessage ? (
        <h2>{resMessage}</h2>
      ) : (
        <h2>Unable to load user notes</h2>
      )}
      <BackButton />
    </div>
  );
}

export default UserNotesList;
