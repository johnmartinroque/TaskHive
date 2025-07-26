import React, { useEffect, useState } from "react";
import { db } from "../../firebase";
import { collection, query, where, getDocs } from "firebase/firestore";
import { Link, useParams } from "react-router-dom";
import { Card, Spinner } from "react-bootstrap";
import "../../src_css/components/task/TaskCard.css";

function FinishedTasks() {
  const { groupId } = useParams();
  const [finishedTasks, setFinishedTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFinishedTasks = async () => {
      try {
        const q = query(
          collection(db, "tasks"),
          where("groupId", "==", groupId),
          where("progress", "==", "Finished")
        );

        const querySnapshot = await getDocs(q);
        const tasks = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setFinishedTasks(tasks);
      } catch (err) {
        console.error("Error fetching finished tasks:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchFinishedTasks();
  }, [groupId]);

  if (loading) return <Spinner animation="border" />;
  if (finishedTasks.length === 0) return <p>No finished tasks yet.</p>;

  return (
    <div className="text-end container">
      <h1 className="text-end mb-4">Finished Tasks</h1>
      <div className="row justify-content-end" style={{marginTop:"3.5rem"}}>
        {finishedTasks.map((task) => (
          <Link to={`/tasks/${task.id}`} key={task.id} className="col-md-6 mb-4 d-flex justify-content-end task-link">
            <Card className="p-3 w-100" style={{ maxWidth: "22rem", backgroundColor: "#1f1f1f", boxShadow: "inset 0px -2px 6px -2px rgba(0, 0, 0, 0.26)", }}>
              <h4 style = {{overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap"}}>
                {task.name}
              </h4>
              <div>Progress: {task.progress}</div>
              {task.finishedBy && <div>Finished by: {task.finishedBy}</div>}
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default FinishedTasks;
