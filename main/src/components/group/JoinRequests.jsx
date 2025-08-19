import React from "react";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../../firebase";
import "../../src_css/components/authentication/Invitations.css"; // Reuse Invitations styles

function JoinRequests({ group, setGroup }) {
  const groupId = group.id;

  const approveRequest = async (memberId) => {
    const updatedMembers = group.members.map((m) =>
      m.id === memberId ? { ...m, role: "member" } : m
    );
    const groupRef = doc(db, "groups", groupId);
    await updateDoc(groupRef, { members: updatedMembers });
    setGroup((prev) => ({ ...prev, members: updatedMembers }));
  };

  const declineRequest = async (memberId) => {
    const updatedMembers = group.members.filter((m) => m.id !== memberId);
    const groupRef = doc(db, "groups", groupId);
    await updateDoc(groupRef, { members: updatedMembers });
    setGroup((prev) => ({ ...prev, members: updatedMembers }));
  };

  const pendingMembers = group.members.filter((m) => m.role === "pending");

  if (pendingMembers.length === 0) return null;

  return (
    <div className="mt-4 invitations-container">
      <h1>Join Requests</h1>
      <ul className="invitations-list list-unstyled">
  {pendingMembers.map((member) => (
    <li
      key={member.id}
      className="request-list-item d-flex justify-content-between align-items-center"
    >
      <div>
        <h4>{member.name}</h4>
        <div className="invite-text">Wants to join your group</div>
      </div>
      <div className="invite-btn-group">
        <button
          className="invite-accept-btn btn btn-success btn-sm"
          onClick={() => approveRequest(member.id)}
        >
          ✔ Accept
        </button>
        <button
          className="invite-decline-btn btn btn-danger btn-sm"
          onClick={() => declineRequest(member.id)}
        >
          ✖ Decline
        </button>
      </div>
    </li>
  ))}
</ul>
    </div>
  );
}

export default JoinRequests;
