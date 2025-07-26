import React, { useEffect, useState } from "react";
import { db, auth } from "../../firebase";
import TaskCard from "./TaskCard";
import { getDocs, collection, query, where } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { Alert, Col, Container, Row, Spinner } from "react-bootstrap";
import "../../src_css/components/task/Tasks.css";

function Tasks({ selectedGroupId, setSelectedGroupId, setSelectedGroupName }) {
  const [tasksByGroup, setTasksByGroup] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const firstGroupId = Object.keys(tasksByGroup)[0];
    if (firstGroupId && !selectedGroupId) {
      setSelectedGroupId(firstGroupId);
      const groupName = tasksByGroup[firstGroupId]?.groupName;
      if (groupName) setSelectedGroupName(groupName);
    }
  }, [tasksByGroup, selectedGroupId]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUserId(user.uid);
        await fetchTasks(user.uid);
      } else {
        setUserId(null);
        setTasksByGroup({});
        setIsLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const fetchTasks = async (uid) => {
    try {
      setIsLoading(true);

      const groupsSnapshot = await getDocs(collection(db, "groups"));

      const userGroups = groupsSnapshot.docs
        .map((doc) => {
          const data = doc.data();
          const userMember = (data.members || []).find((m) => m.id === uid);
          return userMember && userMember.role !== "pending"
            ? {
                id: doc.id,
                name: data.groupName,
              }
            : null;
        })
        .filter(Boolean);

      const tasksRef = collection(db, "tasks");
      const groupedTasks = {};

      for (const group of userGroups) {
        const q = query(tasksRef, where("groupId", "==", group.id));
        const taskSnap = await getDocs(q);

        groupedTasks[group.id] = {
          groupName: group.name,
          tasks: taskSnap.docs
            .map((doc) => {
              const data = doc.data();
              return {
                ...data,
                id: doc.id,
                datePosted:
                  typeof data.datePosted === "string"
                    ? data.datePosted
                    : data.datePosted?.toDate?.() ?? "N/A",
              };
            })
            .filter((task) => task.progress !== "Finished"),
        };
      }

      setTasksByGroup(groupedTasks);
    } catch (err) {
      console.error("Failed to fetch tasks:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container id="group-tasks">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="mb-0">My Group Tasks</h1>
        <div id="choose-group">
          <h4 style={{ margin: 0 }}>
            <a href={`/group/${selectedGroupId}`}>
              {tasksByGroup[selectedGroupId]?.groupName || "Group"}
            </a>
          </h4>

          <li className="nav-link active dropdown">
            <a
              className="nav-link bi bi-caret-down-fill"
              id="group-dropdown"
              href="#"
              role="button"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            ></a>
            <ul className="dropdown-menu" id="group-drop">
              {Object.entries(tasksByGroup).map(([groupId, groupData]) => (
                <li key={groupId}>
                  <button
                    className="dropdown-item"
                    onClick={() => {
                      setSelectedGroupId(groupId);
                      setSelectedGroupName(groupData.groupName);
                    }}
                  >
                    {groupData.groupName}
                  </button>
                </li>
              ))}
            </ul>
          </li>
        </div>
      </div>

      {isLoading ? (
        <div className="d-flex justify-content-center my-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">
              <Spinner />
            </span>
          </div>
        </div>
      ) : userId && selectedGroupId ? (
        <div>
          <Row className="mb-4" id="task-card">
            {Array.isArray(tasksByGroup[selectedGroupId]?.tasks) &&
            tasksByGroup[selectedGroupId].tasks.length > 0 ? (
              tasksByGroup[selectedGroupId].tasks.map((task) => (
                <Col key={task.id} xs={12} sm={6} md={4}>
                  <div className="task-card-wrapper">
                    <TaskCard
                      id={task.id}
                      name={task.name}
                      description={task.description}
                      datePosted={task.datePosted}
                      progress={task.progress}
                      deadline={task.deadline}
                      groupName={tasksByGroup[selectedGroupId].groupName}
                      groupId={selectedGroupId}
                    />
                  </div>
                </Col>
              ))
            ) : (
              <Col>
                <p>No tasks in this group yet.</p>
              </Col>
            )}
          </Row>
        </div>
      ) : (
        <Alert style={{backgroundColor:"transparent", border:"0", color:"#495057"}}>No tasks</Alert>
      )}
    </Container>
  );
}

export default Tasks;
