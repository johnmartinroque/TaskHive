import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate, useLocation } from "react-router-dom";

import { deleteDoc, doc, getDoc, updateDoc } from "firebase/firestore";
import { Card, Container, Button, Spinner } from "react-bootstrap";
import { db } from "../firebase";
import { getAuth } from "firebase/auth";
import DeleteTaskModal from "../components/modals/DeleteTask";

function TaskDetailed() {
  const { taskId } = useParams();
  const [task, setTask] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [progress, setProgress] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const auth = getAuth();
  const currentUser = auth.currentUser;
  const navigate = useNavigate();
  const location = useLocation();
  const fetchTask = async () => {
    try {
      const taskDoc = await getDoc(doc(db, "tasks", taskId));
      if (taskDoc.exists()) {
        const data = { id: taskDoc.id, ...taskDoc.data() };
        setTask(data);
        setProgress(data.progress || "");

        // Fetch group info to check if user is admin
        const groupRef = doc(db, "groups", data.groupId);
        const groupSnap = await getDoc(groupRef);

        if (groupSnap.exists()) {
          const groupData = groupSnap.data();
          const userId = auth.currentUser?.uid;
          const isUserAdmin = groupData.members?.some(
            (member) => member.id === userId && member.role === "admin"
          );
          setIsAdmin(isUserAdmin);
        }
      } else {
        console.log("No such task!");
      }
    } catch (error) {
      console.error("Error fetching task or group:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const deleteTask = async () => {
    try {
      await deleteDoc(doc(db, "tasks", taskId));

      // redirect to group task list
      window.location.href = `/group/${task.groupId}`;
      fetchTask();
    } catch (err) {
      console.error("Error deleting task:", err);
    }
  };

  useEffect(() => {
    fetchTask();
  }, [taskId]);

  if (isLoading) {
    return (
      <div className="d-flex justify-content-center my-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">
            <Spinner />
          </span>
        </div>
      </div>
    );
  }

  if (!task) {
    return (
      <Container>
        <h1 style={{color:"#f6f6f6", marginTop:"10vh"}}>Task not found.</h1>
      </Container>
    );
  }
  const updateTask = async () => {
    try {
      const taskRef = doc(db, "tasks", taskId);
      await updateDoc(taskRef, {
        progress: progress,
        finishedBy:
          progress === "Finished" && currentUser ? currentUser.email : "",
      });
      fetchTask();
      if (location.state?.from) {
        navigate(location.state.from);
      } else if (task?.groupId) {
        navigate(`/group/${task.groupId}`);
      } else {
        navigate("/");
      }
    } catch (err) {
      console.error(err);
    }
  };

  const formattedDate =
    task.datePosted && typeof task.datePosted.toDate === "function"
      ? task.datePosted.toDate().toLocaleDateString("en-US")
      : "N/A";

  return (
    <Container className="my-5 d-flex justify-content-center align-items-center">
      <Card style={{textAlign: "center", borderRadius: "1.2rem", backgroundColor: "#1f1f1f", padding:"1.5rem", width:"70vh"}}>
        <Card.Body>
          <h1 style={{marginBottom: "1rem", color: "#f6f6f6"}}>{task.name}</h1>
          <Card.Subtitle className="mb-2" style={{color: "#f6f6f6"}}>
            Posted on: {formattedDate}
          </Card.Subtitle>
          <Card.Text style={{color: "#f6f6f6"}}>{task.description}</Card.Text>
          <Card.Text style={{color: "#f6f6f6"}}>{task.progress}</Card.Text>
          <select 
            className="form-select"
            value={progress}
            id="container"
            onChange={(e) => {
              setProgress(e.target.value);
            }}
          >
            <option style={{padding:"2rem"}} value="No progress">No progress</option>
            <option style={{padding:"2rem"}} value="In progress">In progress</option>
            <option style={{padding:"2rem"}} value="Finished">Finished</option>
          </select>
          <button id="main-way" style={{marginTop:"1rem"}} variant="success" className="me-2" onClick={updateTask}>
            Update Status
          </button>
          {isAdmin && (
            <>
              <button id="main-way" variant="danger" onClick={() => setShowDeleteModal(true)}>
                Delete Task
              </button>
              <DeleteTaskModal
                show={showDeleteModal}
                onClose={() => setShowDeleteModal(false)}
                onConfirm={deleteTask}
                taskName={task.name}
              />
            </>
          )}
        </Card.Body>
        {/* <Button onclick={`/group/${task.groupId}`} variant="primary">Back</Button> */}
      </Card>
    </Container>
  );
}

export default TaskDetailed;
