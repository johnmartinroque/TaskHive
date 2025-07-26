import React, { useEffect, useState } from "react";
import { getAuth } from "firebase/auth";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../firebase";
import { Link } from "react-router-dom";
import { Container, Row, Col, Card } from "react-bootstrap";
import "../../src_css/components/group/MyGroups.css";

function MyGroups() {
  const [myGroups, setMyGroups] = useState([]);
  const auth = getAuth();
  const user = auth.currentUser;
  const userId = user?.uid;

  useEffect(() => {
    const fetchMyGroups = async () => {
      if (!userId) return;

      const groupCollectionRef = collection(db, "groups");
      const groupSnapshot = await getDocs(groupCollectionRef);

      const filteredGroups = groupSnapshot.docs
        .map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }))
        .filter((group) =>
          group.members?.some(
            (member) => member.id === userId && member.role !== "pending"
          )
        );

      setMyGroups(filteredGroups);
    };

    fetchMyGroups();
  }, [userId]);

  return (
    <Container id="my-groups">
      <h1 className="mt-4">My Groups</h1>
      <Row>
        {myGroups.length > 0 ? (
          myGroups.map((group) => (
            <Col md={4} key={group.id}>
              <Link to={`/group/${group.id}`} className="group-link">
                <Card className="group-card">
                  <Card.Body>
                    <h3>{group.groupName}</h3>
                    <p className="group-members">
                      Members: {group.members?.length || 0}
                    </p>
                  </Card.Body>
                </Card>
              </Link>
            </Col>
          ))
        ) : (
          <p className="mt-4">You are not a member of any groups.</p>
        )}
      </Row>
    </Container>
  );
}

export default MyGroups;
