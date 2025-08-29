import React, { useState } from "react";
import {
  collection,
  query,
  where,
  getDocs,
  addDoc,
  or,
} from "firebase/firestore";
import { db } from "../../firebase";
import { Form, Button, ListGroup, InputGroup } from "react-bootstrap";

function InviteMembers({ group }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [invitingId, setInvitingId] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");

  const handleSearch = async () => {
    if (!searchTerm.trim()) return;

    try {
      const usersRef = collection(db, "users");

      const nameQuery = query(
        usersRef,
        where("name", ">=", searchTerm),
        where("name", "<=", searchTerm + "\uf8ff")
      );

      const emailQuery = query(
        usersRef,
        where("email", ">=", searchTerm),
        where("email", "<=", searchTerm + "\uf8ff")
      );

      const [nameSnapshot, emailSnapshot] = await Promise.all([
        getDocs(nameQuery),
        getDocs(emailQuery),
      ]);

      const resultsMap = new Map();

      nameSnapshot.forEach((doc) => {
        const data = doc.data();
        resultsMap.set(data.uid, { id: doc.id, ...data });
      });

      emailSnapshot.forEach((doc) => {
        const data = doc.data();
        resultsMap.set(data.uid, { id: doc.id, ...data });
      });

      setSearchResults(Array.from(resultsMap.values()));
    } catch (err) {
      console.error("Error searching users:", err);
    }
  };

  const handleInvite = async (user) => {
    if (!group) return;

    setInvitingId(user.uid);
    setSuccessMessage("");

    try {
      await addDoc(collection(db, "invitations"), {
        inviteeId: user.uid,
        inviteeName: user.name,
        inviteeEmail: user.email,
        groupName: group.groupName,
        groupId: group.id,
        status: "pending",
        invitedAt: new Date(),
      });
      setSuccessMessage(`Invitation sent to ${user.name}`);
    } catch (err) {
      console.error("Error sending invitation:", err);
    } finally {
      setInvitingId(null);
    }
  };

  return (
    <div className="my-4">
      <h1>Invite Members</h1>
      <InputGroup className="mb-3">
        <Form.Control
          id="search-form-user"
          type="text"
          placeholder="Search users by name or email"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button id="search-but-user" className="btn btn-outline-success bi bi-search" onClick={handleSearch}></button>
      </InputGroup>

      {successMessage && <p className="text-success">{successMessage}</p>}

      {searchResults.length > 0 && (
  <ul className="invitations-list requests-grid list-unstyled">
    {searchResults.map((user) => (
      <li
        key={user.uid}
        className="request-list-item d-flex justify-content-between align-items-center"
      >
        <div>
          <h4>{user.name}</h4>
          <div className="invite-text text-muted small">{user.email}</div>
        </div>
        <div className="invite-btn-group">
          <button
            className="btn btn-warning invite-decline-btn btn-sm"
            onClick={() => handleInvite(user)}
            disabled={invitingId === user.uid}
          >
            {invitingId === user.uid ? "Inviting..." : "Invite"}
          </button>
        </div>
      </li>
    ))}
  </ul>
)}

    </div>
  );
}

export default InviteMembers;
