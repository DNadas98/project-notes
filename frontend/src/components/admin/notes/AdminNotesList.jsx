import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import AdminNoteItem from "./AdminNoteItem";
import BackButton from "../../BackButton";
import useApiFetch from "../../../hooks/useApiFetch";

function AdminNotesList() {
  const apiFetch = useApiFetch();
  const user = useLocation()?.state?.user;
  const [loading, setLoading] = useState(true);
  const [userNotes, setUserNotes] = useState(null);
  const [resMessage, setResMessage] = useState(null);
  const [filteredNotes, setFilteredNotes] = useState(null);

  useEffect(() => {
    async function getNotes() {
      try {
        let path = "admin/notes";
        if (user) {
          path = `admin/notes/${encodeURI(user?._id)}`;
        }
        const { responseObject } = await apiFetch("GET", path);
        if (responseObject?.data) {
          setUserNotes(responseObject.data);
          setFilteredNotes(responseObject.data);
        } else {
          setUserNotes(null);
          setFilteredNotes(null);
          responseObject?.message ? setResMessage(responseObject.message) : setResMessage("Failed to load notes");
        }
      } catch (err) {
        setResMessage("Failed to load notes");
      } finally {
        setLoading(false);
      }
    }
    getNotes();
  }, [apiFetch, setLoading, user]);

  function handleSearch(searchValue) {
    setFilteredNotes(userNotes.filter((note) => note.title.toLowerCase().includes(searchValue.toLowerCase())));
  }

  return (
    <div className="AdminNotesList column">
      <div className="row">
        <input
          type="text"
          placeholder="Search notes"
          onInput={(event) => {
            handleSearch(event.target.value);
          }}
        />
      </div>
      {user ? <h1>{user?.username}'s notes</h1> : <h1>Notes</h1>}
      {loading ? (
        <h2>Loading...</h2>
      ) : userNotes ? (
        <ul className="column">
          {filteredNotes.map((note) => {
            return <AdminNoteItem key={note._id} note={note} />;
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

export default AdminNotesList;
