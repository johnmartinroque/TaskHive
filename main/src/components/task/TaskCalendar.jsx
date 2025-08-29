import React, { useEffect, useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { db, auth } from "../../firebase";
import { collection, getDocs, query, where } from "firebase/firestore";
import TaskCard from "./TaskCard";
import "../../src_css/components/task/TaskCalendar.css";
import { onAuthStateChanged } from "firebase/auth";

function TaskCalendar() {
  const [deadlineCounts, setDeadlineCounts] = useState({});
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(null);
  const [tasksByDate, setTasksByDate] = useState({});
  const [userId, setUserId] = useState(null);

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
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUserId(user.uid);
        await fetchTasks(user.uid);
      } else {
        setUserId(null);
        setDeadlineCounts({});
        setTasksByDate({});
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const fetchTasks = async (uid) => {
    try {
      setLoading(true);

      // Get the groups the user is a member of
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
      const counts = {};
      const tasksMap = {};

      // Fetch tasks for each group the user is a member of
      for (const group of userGroups) {
        const q = query(tasksRef, where("groupId", "==", group.id));
        const taskSnap = await getDocs(q);

        taskSnap.forEach((docSnap) => {
          const task = docSnap.data();
          const deadlineStr = task.deadline;

          const progress = task.progress;

          if (progress === "Finished") {
            return;
          }

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
      }

      setDeadlineCounts(counts);
      setTasksByDate(tasksMap);
    } catch (err) {
      console.error("Error fetching tasks with deadlines:", err);
    } finally {
      setLoading(false);
    }
  };

  const tileContent = ({ date, view }) => {
    if (view !== "month") return null;
    const key = formatLocalDate(date);
    if (deadlineCounts[key]) {
      return (
        <div className="deadline-count">
          {deadlineCounts[key]}
          {deadlineCounts[key] > 1 ? "" : ""}
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
