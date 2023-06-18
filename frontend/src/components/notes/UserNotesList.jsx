import React, { useEffect, useState } from "react";
import useApiFetch from "../../hooks/useApiFetch";
import BackButton from "../BackButton";
import UserNoteItem from "./UserNoteItem";
import { Link } from "react-router-dom";
import LoadingSpinner from "../LoadingSpinner";
import Confirm from "../Confirm";

function UserNotesList() {
  const apiFetch = useApiFetch();
  const [loading, setLoading] = useState(true);
  const [userNotes, setUserNotes] = useState(null);
  const [resMessage, setResMessage] = useState(null);
  const [filteredNotes, setFilteredNotes] = useState(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [confirmText, setConfirmText] = useState("");
  const [onConfirm, setOnConfirm] = useState(null);

  async function getUserNotes() {
    try {
      const { responseObject } = await apiFetch("GET", "notes");
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

  useEffect(() => {
    getUserNotes();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [apiFetch, setLoading]);

  async function handleDelete(noteid) {
    try {
      setLoading(true);
      const { httpResponse, responseObject } = await apiFetch("DELETE", "notes", { "_id": noteid });
      if (httpResponse?.status === 200 && responseObject?.message) {
        await getUserNotes();
      }
    } catch (err) {
    } finally {
      setLoading(false);
    }
  }

  function handleSearch(searchValue) {
    setFilteredNotes(userNotes.filter((note) => note.title.toLowerCase().includes(searchValue.toLowerCase())));
  }

  return (
    <div className="UserNotesList column">
      <Confirm
        showConfirm={showConfirm}
        setShowConfirm={setShowConfirm}
        confirmText={confirmText}
        onConfirm={onConfirm}
        setOnConfirm={setOnConfirm}
      />
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
        <LoadingSpinner />
      ) : userNotes ? (
        <ul className="column">
          {filteredNotes.map((note) => {
            return (
              <UserNoteItem
                key={note._id}
                note={note}
                getUserNotes={getUserNotes}
                setConfirmText={setConfirmText}
                handleDelete={handleDelete}
                setShowConfirm={setShowConfirm}
                setOnConfirm={setOnConfirm}
              />
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
