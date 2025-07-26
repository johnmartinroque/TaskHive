import React, { useEffect, useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { db } from "../../firebase";
import { collection, getDocs } from "firebase/firestore";
import TaskCard from "./TaskCard";

function TaskCalendar() {
  const [deadlineCounts, setDeadlineCounts] = useState({});
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(null);
  const [tasksByDate, setTasksByDate] = useState({});

  // ✅ Format local date as YYYY-MM-DD
  const formatLocalDate = (date) => {
    return (
      date.getFullYear() +
      "-" +
      String(date.getMonth() + 1).padStart(2, "0") +
      "-" +
      String(date.getDate()).padStart(2, "0")
    );
  };

  useEffect(() => {
    const fetchTasksWithDeadlines = async () => {
      try {
        const tasksSnapshot = await getDocs(collection(db, "tasks"));
        const counts = {};
        const tasksMap = {};

        tasksSnapshot.forEach((docSnap) => {
          const task = docSnap.data();
          const deadlineStr = task.deadline;

          if (deadlineStr) {
            const date = new Date(deadlineStr);
            if (!isNaN(date)) {
              const dateKey = formatLocalDate(date);
              counts[dateKey] = (counts[dateKey] || 0) + 1;
              if (!tasksMap[dateKey]) tasksMap[dateKey] = [];
              tasksMap[dateKey].push({ id: docSnap.id, ...task });
            }
          }
        });

        setDeadlineCounts(counts);
        setTasksByDate(tasksMap);
      } catch (err) {
        console.error("Error fetching tasks with deadlines:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchTasksWithDeadlines();
  }, []);

  const tileContent = ({ date, view }) => {
    if (view !== "month") return null;
    const key = formatLocalDate(date);
    if (deadlineCounts[key]) {
      return (
        <div
          className="deadline-count"
          style={{ fontSize: "0.7rem", color: "red" }}
        >
          {deadlineCounts[key]} task{deadlineCounts[key] > 1 ? "s" : ""}
        </div>
      );
    }
    return null;
  };

  const handleDateClick = (date) => {
    setSelectedDate(formatLocalDate(date));
  };

  const selectedTasks = selectedDate ? tasksByDate[selectedDate] || [] : [];

  return (
    <div className="calendar-container my-4">
      <h4>All Task Deadlines</h4>
      {loading ? (
        <p>Loading calendar...</p>
      ) : (
        <>
          <Calendar tileContent={tileContent} onClickDay={handleDateClick} />
          {selectedDate && (
            <div className="mt-4">
              <h5>Tasks due on {selectedDate}:</h5>
              {selectedTasks.length > 0 ? (
                <div className="d-flex flex-column gap-3">
                  {selectedTasks.map((task) => (
                    <TaskCard
                      key={task.id}
                      id={task.id}
                      name={task.name}
                      description={task.description}
                      datePosted={task.datePosted}
                      progress={task.progress}
                      deadline={task.deadline}
                      groupName={task.groupName}
                    />
                  ))}
                </div>
              ) : (
                <p>No tasks due on this day.</p>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default TaskCalendar;
