import React, { useEffect, useState } from "react";
import {
  collection,
  getDocs,
  doc,
  updateDoc,
  arrayUnion,
} from "firebase/firestore";
import { useSearchParams, Link } from "react-router-dom";
import { Card, Container, Row, Col, Spinner, Button } from "react-bootstrap";
import { db } from "../firebase";
import { getAuth } from "firebase/auth";

function Search() {
  const [groups, setGroups] = useState([]);
  const [filteredGroups, setFilteredGroups] = useState([]);
  const [pendingGroupIds, setPendingGroupIds] = useState([]);
  const [loading, setLoading] = useState(true);

  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get("q")?.toLowerCase() || "";

  const auth = getAuth();
  const user = auth.currentUser;
  const userId = user?.uid;

  useEffect(() => {
    const fetchGroups = async () => {
      setLoading(true);
      try {
        const groupCollectionRef = collection(db, "groups");
        const data = await getDocs(groupCollectionRef);
        const allGroups = data.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        }));

        setGroups(allGroups);

        const filtered = allGroups.filter((group) =>
          group.groupName?.toLowerCase().includes(searchQuery)
        );
        setFilteredGroups(filtered);

        const pendingIds = filtered
          .filter((group) =>
            group.members?.some((m) => m.id === userId && m.role === "pending")
          )
          .map((g) => g.id);

        setPendingGroupIds(pendingIds);
      } catch (err) {
        console.error("Error fetching groups:", err);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchGroups();
    }
  }, [searchQuery, user]);

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

  return (
    <Container className="mt-4">
      <h1>Search Results for "{searchQuery}"</h1>
      <Row className="mt-3">
        {loading ? (
          <div className="text-center my-5">
            <Spinner animation="border" variant="primary" />
            <p>Loading groups...</p>
          </div>
        ) : filteredGroups.length > 0 ? (
          filteredGroups.map((group) => (
            <Col key={group.id} md={4} className="mb-3">
              <Link to={`/group/${group.id}`} className="group-link">
                <Card className="group-card">
                  <Card.Body>
                    <h3>{group.groupName}</h3>
                    <div className="mt-2">
                      {group.members?.some((m) => m.id === userId) ? (
                        <Button variant="secondary" disabled id="main-way">
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
              </Link>
            </Col>
          ))
        ) : (
          <p>No groups found named "{searchQuery}"</p>
        )}
      </Row>
    </Container>
  );
}

export default Search;
