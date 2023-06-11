import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import useAuth from "../../../hooks/useAuth";

function UserNotesList() {
  const [loading, setLoading] = useState(true);
  const [userNotes, setUserNotes] = useState(null);
  const [resMessage, setResMessage] = useState(null);
  const { auth } = useAuth();
  const accessToken = auth.accessToken;

  useEffect(() => {
    async function getUserNotes() {
      try {
        const apiUrl = "http://127.0.0.1:3501/api"; //process.env.REACT_APP_API_URL;
        const url = `${apiUrl}/notes`;
        const httpResponse = await fetch(url, {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${accessToken}`,
            "Content-Type": "application/json"
          },
          credentials: "include" /* include cookies and auth header */
        });
        const responseObject = await httpResponse.json();
        console.log(responseObject);
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
  }, [accessToken]);

  return (
    <div className="UserNotesList column">
      <h1>User notes</h1>
      {loading ? (
        <h2>Loading...</h2>
      ) : userNotes ? (
        <ul className="column">
          {userNotes.map((note) => {
            return (
              <li key={note.id}>
                <h1>{note.title}</h1>
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
