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
  const [filteredNotes, setFilteredNotes] = useState(null);

  async function getUserNotes() {
    try {
      const { responseObject } = await apiFetch("GET", "notes");
      if (responseObject?.data) {
        setUserNotes(responseObject.data);
        setFilteredNotes(responseObject.data);
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

  function handleSearch(searchValue) {
    setFilteredNotes(userNotes.filter((note) => note.title.toLowerCase().includes(searchValue.toLowerCase())));
  }

  return (
    <div className="UserNotesList column">
      <h1>User notes</h1>
      <div className="row">
        <input
          type="text"
          placeholder="Search notes"
          onInput={(event) => {
            handleSearch(event.target.value);
          }}
        />
        <Link to="create">
          <button>Create new note</button>
        </Link>
      </div>
      {loading ? (
        <h2>Loading...</h2>
      ) : userNotes ? (
        <ul className="column">
          {filteredNotes.map((note) => {
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
