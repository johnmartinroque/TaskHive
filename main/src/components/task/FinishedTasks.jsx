import React, { useEffect, useState } from "react";
import { db } from "../../firebase";
import { collection, query, where, getDocs } from "firebase/firestore";
import { Link, useParams } from "react-router-dom";
import { Card, Spinner } from "react-bootstrap";
import "../../src_css/components/task/TaskCard.css";
import "../../src_css/components/task/FinishedTasks.css";

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
      <h1 className="mb-5 text-center text-md-end me-auto">Finished Tasks</h1>
      <div className="row justify-content-end">
        {finishedTasks.map((task) => (
          <Link to={`/tasks/${task.id}`} key={task.id} className="col-md-6 mb-4 d-flex justify-content-end task-link">
            <Card className="p-3 w-100" style={{ background: "rgba(255,255,255, 0.05)", backdropFilter: "blur(8px)",WebkitBackdropFilter: "blur(8px)",border: "1px solid rgba(255, 255, 255, 0.15)",boxShadow:"inset 0 0 0.5px rgba(255, 255, 255, 0.25), inset 0 0 5px rgba(255, 255, 255, 0.06), 0 8px 16px rgba(0, 0, 0, 0.4), 0 4px 6px rgba(255, 255, 255, 0.03)", }}>
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
