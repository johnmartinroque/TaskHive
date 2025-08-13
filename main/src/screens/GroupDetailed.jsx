import { useParams, useNavigate } from "react-router-dom";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../firebase";
import { useEffect, useState } from "react";
import AddTask from "../components/task/AddTask";
import { Col, Row, Button } from "react-bootstrap";
import GroupTasks from "../components/task/GroupTasks";
import { getAuth } from "firebase/auth";
import GroupMembers from "../components/group/GroupMembers";
import LeaveGroup from "../components/modals/LeaveGroup";
import RemoveMember from "../components/modals/RemoveMember";
import Scores from "../components/group/Scores";
import FinishedTasks from "../components/task/FinishedTasks";
import JoinRequests from "../components/group/JoinRequests";
import Chat from "../components/group/chat/Chat";
import Graph from "../components/group/graph/Graph";
import InviteMembers from "../components/group/InviteMembers";
import "../src_css/screens/GroupDetailed.css";
function GroupDetailed() {
  const { groupId } = useParams();
  const [group, setGroup] = useState(null);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showLeaveModal, setShowLeaveModal] = useState(false);
  const [showRemoveModal, setShowRemoveModal] = useState(false);
  const [memberToRemove, setMemberToRemove] = useState(null);
  const [isPending, setIsPending] = useState(false);
  const [isChatMinimized, setIsChatMinimized] = useState(true);

  const navigate = useNavigate();

  const auth = getAuth();
  const user = auth.currentUser;

  const leaveGroup = async () => {
    if (!group || !user) return;

    const updatedMembers = group.members.filter((m) => m.id !== user.uid);

    try {
      const groupRef = doc(db, "groups", groupId);
      await updateDoc(groupRef, {
        members: updatedMembers,
      });

      navigate("/");
    } catch (err) {
      console.error("Failed to leave group:", err);
    }
  };

  const confirmLeaveGroup = async () => {
    setShowLeaveModal(false);

    if (!group || !user) return;

    const updatedMembers = group.members.filter((m) => m.id !== user.uid);

    try {
      const groupRef = doc(db, "groups", groupId);
      await updateDoc(groupRef, {
        members: updatedMembers,
      });

      navigate("/");
    } catch (err) {
      console.error("Failed to leave group:", err);
    }
  };

  useEffect(() => {
    const fetchGroup = async () => {
      if (!user) {
        setIsLoading(false);
        return;
      }

      try {
        const groupRef = doc(db, "groups", groupId);
        const groupSnap = await getDoc(groupRef);

        if (groupSnap.exists()) {
          const groupData = groupSnap.data();
          const memberList = groupData.members || [];

          const currentUser = memberList.find((m) => m.id === user.uid);
          const isMember = !!currentUser;
          const isUserAdmin = currentUser?.role === "admin";
          const isUserPending = currentUser?.role === "pending";

          setIsAuthorized(isMember);
          setIsPending(isUserPending);
          setIsAdmin(isUserAdmin);
          setGroup({ id: groupSnap.id, ...groupData });
        } else {
          console.log("Group not found");
          navigate("/groups");
        }
      } catch (err) {
        console.error("Error fetching group:", err);
      }

      setIsLoading(false);
    };

    fetchGroup();
  }, [groupId, user, navigate]);

  const handleRemoveMember = async (memberId) => {
    if (!group) return;

    const updatedMembers = group.members.filter((m) => m.id !== memberId);

    try {
      const groupRef = doc(db, "groups", groupId);
      await updateDoc(groupRef, {
        members: updatedMembers,
      });

      // Update UI
      setGroup((prev) => ({
        ...prev,
        members: updatedMembers,
      }));
    } catch (err) {
      console.error("Failed to remove member:", err);
    }
  };

  const requestRemoveMember = (member) => {
    setMemberToRemove(member);
    setShowRemoveModal(true);
  };

  const confirmRemoveMember = async () => {
    if (!group || !memberToRemove) return;

    const updatedMembers = group.members.filter(
      (m) => m.id !== memberToRemove.id
    );

    try {
      const groupRef = doc(db, "groups", groupId);
      await updateDoc(groupRef, {
        members: updatedMembers,
      });

      setGroup((prev) => ({
        ...prev,
        members: updatedMembers,
      }));

      setShowRemoveModal(false);
      setMemberToRemove(null);
    } catch (err) {
      console.error("Failed to remove member:", err);
    }
  };

  if (isLoading) return <p>Loading...</p>;
  if (!user) return <p>Please log in to view this group.</p>;
  if (!isAuthorized)
    return <p>Access denied. You are not a member of this group.</p>;
  if (isPending) return <p>Your request to join is pending.</p>;
  if (!group) return <p>Group not found.</p>;

  return (
    <div className="group-detailed-wrapper">
      <h1>{group.groupName}</h1>
      <GroupMembers
        members={group.members}
        isAdmin={isAdmin}
        handleRemoveMember={requestRemoveMember}
      />

      <Row>
        <Col>
          <AddTask groupId={group.id} groupName={group.groupName} />
        </Col>
        <Col>
        <Graph selectedGroupId={group.id} />
        </Col>
      </Row>

      <Row className="mt-5">
        <Col>

        <div className="d-flex justify-content-between align-items-center">
          <h1 className="me-auto mb-2">Group Tasks</h1>
          {isAuthorized && (
            <Button
              id="buttones"
              variant="warning"
              className="mb-2 ms-auto"
              onClick={() => setShowLeaveModal(true)}
              disabled={
                isAdmin &&
                group.members.filter((m) => m.role === "admin").length === 1
              }
            >
              <h4>Leave Group</h4>
            </Button>
          )}
        </div>

          <GroupTasks groupId={group.id} />
          
        </Col>
        <Col>
          <FinishedTasks />
        </Col>
      </Row>
      <LeaveGroup
        show={showLeaveModal}
        onClose={() => setShowLeaveModal(false)}
        onConfirm={confirmLeaveGroup}
        title="Leave Group Confirmation"
        body={`Are you sure you want to leave "${group.groupName}"?`}
      />
      <RemoveMember
        show={showRemoveModal}
        onClose={() => setShowRemoveModal(false)}
        onConfirm={confirmRemoveMember}
        name={memberToRemove?.name || "this member"}
      />

      <Chat groupId={group.id} groupMembers={group.members} />
    </div>
  );
}

export default GroupDetailed;
