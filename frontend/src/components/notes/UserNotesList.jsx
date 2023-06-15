import React, { useEffect, useState } from "react";
import useApiFetch from "../../hooks/useApiFetch";
import BackButton from "../BackButton";
import UserNoteItem from "./UserNoteItem";
import { Link } from "react-router-dom";

function UserNotesList() {
  const apiFetch = useApiFetch();
  const [loading, setLoading] = useState(true);
  const [userNotes, setUserNotes] = useState(null);
  const [resMessage, setResMessage] = useState(null);

  async function getUserNotes() {
    try {
      const { responseObject } = await apiFetch("GET", "notes");
      if (responseObject?.data) {
        setUserNotes(responseObject.data);
      } else if (responseObject?.message) {
        setUserNotes(null);
        setResMessage(responseObject.message);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    getUserNotes();
  }, [apiFetch, setLoading]);

  return (
    <div className="UserNotesList column">
      <Link to="create">
        <button>Create new note</button>
      </Link>
      <h1>User notes</h1>
      {loading ? (
        <h2>Loading...</h2>
      ) : userNotes ? (
        <ul className="column">
          {userNotes
            .sort((a, b) => a.title.localeCompare(b.title))
            .map((note) => {
              return <UserNoteItem key={note._id} note={note} getUserNotes={getUserNotes} />;
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
