import React, { useEffect, useState } from "react";
import {
  collection,
  query,
  where,
  getDocs,
  deleteDoc,
  doc,
  updateDoc,
} from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { Button, ListGroup } from "react-bootstrap";
import { db } from "../../firebase";
import { useNavigate } from "react-router-dom";

function Invitations() {
  const [invitations, setInvitations] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const auth = getAuth();
  const user = auth.currentUser;

  useEffect(() => {
    const fetchInvitations = async () => {
      if (!user) return;

      try {
        const invitesRef = collection(db, "invitations");
        const q = query(invitesRef, where("inviteeId", "==", user.uid));
        const snapshot = await getDocs(q);

        const results = snapshot.docs.map((docSnap) => ({
          id: docSnap.id,
          ...docSnap.data(),
        }));

        setInvitations(results);
      } catch (err) {
        console.error("Error fetching invitations:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchInvitations();
  }, [user]);

  const removeInvitation = async (inviteId) => {
    await deleteDoc(doc(db, "invitations", inviteId));
    setInvitations((prev) => prev.filter((i) => i.id !== inviteId));
  };

  const acceptInvitation = async (invite) => {
    if (!user) return;

    const groupRef = doc(db, "groups", invite.groupId);

    try {
      const groupSnap = await getDocs(
        query(collection(db, "groups"), where("__name__", "==", invite.groupId))
      );

      if (!groupSnap.empty) {
        const groupData = groupSnap.docs[0].data();
        const currentMembers = groupData.members || [];

        const isAlreadyMember = currentMembers.some((m) => m.id === user.uid);
        if (!isAlreadyMember) {
          const updatedMembers = [
            ...currentMembers,
            {
              id: user.uid,
              name: user.displayName || user.email.split("@")[0],
              role: "member",
            },
          ];
          await updateDoc(groupRef, { members: updatedMembers });
        }
      }

      await removeInvitation(invite.id); // delete after accepting
      navigate(`/group/${invite.groupId}`);
    } catch (err) {
      console.error("Failed to accept invitation:", err);
    }
  };

  const declineInvitation = async (inviteId) => {
    try {
      await removeInvitation(inviteId); // delete after declining
    } catch (err) {
      console.error("Failed to decline invitation:", err);
    }
  };

  if (loading) return <p>Loading invitations...</p>;
  if (!user) return <p>Please log in to view your invitations.</p>;
  if (invitations.length === 0) return <p>No invitations at the moment.</p>;

  return (
    <div className="mt-4">
      <h4>Group Invitations</h4>
      <ListGroup>
        {invitations.map((invite) => (
          <ListGroup.Item
            key={invite.id}
            className="d-flex justify-content-between align-items-center"
          >
            <div>
              <strong>{invite.groupName}</strong>
              <div className="text-muted small">
                You’ve been invited to join
              </div>
            </div>
            <div>
              <Button
                variant="success"
                size="sm"
                className="me-2"
                onClick={() => acceptInvitation(invite)}
              >
                ✔ Accept
              </Button>
              <Button
                variant="danger"
                size="sm"
                onClick={() => declineInvitation(invite.id)}
              >
                ✖ Decline
              </Button>
            </div>
          </ListGroup.Item>
        ))}
      </ListGroup>
    </div>
  );
}

export default Invitations;
