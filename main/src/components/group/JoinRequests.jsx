import React from "react";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../../firebase";

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
    <div className="mt-4">
      <h5>Join Requests</h5>
      <ul className="list-group">
        {pendingMembers.map((member) => (
          <li
            key={member.id}
            className="list-group-item d-flex justify-content-between align-items-center"
          >
            {member.name}
            <div>
              <button
                className="btn btn-success btn-sm me-2"
                onClick={() => approveRequest(member.id)}
              >
                ✔ Accept
              </button>
              <button
                className="btn btn-danger btn-sm"
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
