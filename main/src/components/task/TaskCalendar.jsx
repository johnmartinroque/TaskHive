import React, { useEffect, useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { db } from "../../firebase";
import { collection, getDocs } from "firebase/firestore";
import TaskCard from "./TaskCard";
import "../../src_css/components/task/TaskCalendar.css";

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
    <div className="calendar-container d-flex flex-column align-items-center">
      <h1>All Task Deadlines</h1>
      {loading ? (
        <p>Loading calendar...</p>
      ) : (
        <>
          <Calendar tileContent={tileContent} onClickDay={handleDateClick} />
          {selectedDate && (
            <div className="mt-4">
              <h2>Tasks due on {selectedDate}:</h2>
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
                <h4>No tasks due on this day.</h4>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default TaskCalendar;
