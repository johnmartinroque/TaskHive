import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  addDoc,
  arrayUnion,
  collection,
  doc,
  getDocs,
  updateDoc,
} from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { db } from "../../firebase";
import { Button, Card, Col, Container, Row } from "react-bootstrap";
import { Link } from "react-router-dom";

function Groups() {
  const [newGroupName, setNewGroupName] = useState("");
  const [groupList, setGroupList] = useState([]);
  const [pendingGroupIds, setPendingGroupIds] = useState([]);

  const groupCollectionRef = collection(db, "groups");
  const auth = getAuth();
  const user = auth.currentUser;
  const navigate = useNavigate();

  const userId = user?.uid;

  const getGroupList = async () => {
    const data = await getDocs(groupCollectionRef);
    const groups = data.docs.map((doc) => ({
      ...doc.data(),
      id: doc.id,
    }));

    setGroupList(groups);

    // Get pending group IDs for the logged-in user
    const pendingIds = groups
      .filter((group) =>
        group.members?.some((m) => m.id === userId && m.role === "pending")
      )
      .map((g) => g.id);

    setPendingGroupIds(pendingIds);
  };

  const createGroup = async () => {
    if (!user) {
      alert("You must be logged in to create a group.");
      return;
    }

    const trimmedGroupName = newGroupName.trim();
    if (!trimmedGroupName) {
      alert("Group name cannot be empty.");
      return;
    }

    const duplicate = groupList.some(
      (group) =>
        group.groupName.toLowerCase() === trimmedGroupName.toLowerCase()
    );
    if (duplicate) {
      alert("A group with this name already exists.");
      return;
    }

    const newGroup = {
      groupName: trimmedGroupName,
      members: [
        {
          id: user.uid,
          name: user.displayName || user.email.split("@")[0],
          role: "admin",
        },
      ],
    };

    try {
      const docRef = await addDoc(groupCollectionRef, newGroup);
      setNewGroupName("");
      await getGroupList();
      navigate(`/group/${docRef.id}`);
    } catch (err) {
      console.error("Error creating group:", err);
    }
  };

  const joinGroup = async (groupId) => {
    if (!user) {
      alert("You must be logged in to join a group.");
      return;
    }

    const groupRef = doc(db, "groups", groupId);
    try {
      await updateDoc(groupRef, {
        members: arrayUnion({
          id: user.uid,
          name: user.displayName || user.email.split("@")[0],
          role: "pending",
        }),
      });

      setPendingGroupIds((prev) => [...prev, groupId]);
      console.log("Request to join group sent.");
    } catch (err) {
      console.error("Error sending join request:", err);
    }
  };

  useEffect(() => {
    if (user) {
      getGroupList();
    }
  }, [user]);

  return (
    <Container>
      {/* 
      <Row className="mb-4">
        <Col>
          <h1>Groups</h1>
        </Col>
      </Row> */}

      {/*   <Row>
        {groupList.map((group) => (
          <Col key={group.id} md={4} className="mb-3">
            <Card>
              <Card.Body>
                <h5>{group.groupName}</h5>
                <Link to={`/group/${group.id}`}>View Group</Link>
                <div className="mt-2">
                  {group.members?.some((m) => m.id === userId) ? (
                    <Button variant="secondary" disabled>
                      {group.members.find((m) => m.id === userId)?.role ===
                      "pending"
                        ? "Pending"
                        : "Member"}
                    </Button>
                  ) : pendingGroupIds.includes(group.id) ? (
                    <Button variant="warning" disabled>
                      Pending
                    </Button>
                  ) : (
                    <Button onClick={() => joinGroup(group.id)}>Join</Button>
                  )}
                </div>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row> */}

      <Row className="mt-4">
        <Col>
          <h4>Create Group</h4>
          <input
            placeholder="Input new group name"
            value={newGroupName}
            onChange={(e) => setNewGroupName(e.target.value)}
            className="form-control mb-2"
          />
          <Button onClick={createGroup}>Create Group</Button>
        </Col>
      </Row>
    </Container>
  );
}

export default Groups;
