import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import useApiFetch from "../../../hooks/useApiFetch";

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
                <li key={note._id} className="column">
                  <h2>{note.title}</h2>
                  <p>{note.completed ? "Completed" : "Not completed yet"}</p>
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
      <Link to="/user">
        <button>Back</button>
      </Link>
    </div>
  );
}

export default UserNotesList;
