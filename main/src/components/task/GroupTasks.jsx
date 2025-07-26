import { useEffect, useState } from "react";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import { db } from "../../firebase";
import { Link, useParams } from "react-router-dom";
import { Card, Spinner, Row, Col } from "react-bootstrap";
import "../../src_css/components/task/TaskCard.css";

function GroupTasks() {
  const { groupId } = useParams(); // assumes groupId is in URL
  const [tasks, setTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!groupId) return;

    const tasksRef = collection(db, "tasks");
    const q = query(tasksRef, where("groupId", "==", groupId));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const tasksData = snapshot.docs
        .map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }))
        .filter((task) => task.progress !== "Finished");
      setTasks(tasksData);
      setIsLoading(false);
    });

    // Clean up real-time listener on unmount
    return () => unsubscribe();
  }, [groupId]);

  if (isLoading) return <Spinner animation="border" variant="primary" />;

  return (
    <div className="group-task">
      <h1>Group Tasks</h1>
      {tasks.length === 0 ? (
        <p>No tasks found for this group.</p>
      ) : (
        <Row>
          {tasks.map((task) => (
            <Col key={task.id} md={6} lg={4}>
                <Link  to={`/tasks/${task.id}`} className="task-link">
              <Card className="group-task-carda">
                <Card.Body>
                  <Card.Title>
                    <h4 className="group-task-name">{task.name}</h4>
                  </Card.Title>
                  <p className="group-task-desc"><strong>Description:</strong> {task.description}</p>
                  <p><strong>Date Posted:</strong> {task.datePosted}</p>
                  {/* {deadline ? <p className="task-dead">Deadline: {deadline}</p> : <> <p className="task-dead">No deadline</p></>} */}
                  <p className="group-task-progress"><strong>Progress:</strong> {task.progress}</p>
                  <p className="group-task-created"><strong>Created By:</strong>{task.createdBy}</p>
                  {/* <Card.Text >
                    <strong>Description:</strong> {task.description}
                    <br />
                    <strong>Date Posted:</strong> {task.datePosted}
                    <br />
                    <strong>Progress:</strong> {task.progress}
                    <br />
                    <strong>Created By:</strong> {task.createdBy}
                  </Card.Text> */}
                </Card.Body>
              </Card>
              </Link>
            </Col>
          ))}
        </Row>
      )}
    </div>
  );
}

export default GroupTasks;
