import React, { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  LabelList
} from "recharts";
import { collection, query, where, getDocs } from "firebase/firestore";
import { Spinner } from "react-bootstrap";
import { db } from "../../../firebase";

function Graph({ selectedGroupId }) {
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTopFinishers = async () => {
      if (!selectedGroupId) return;

      setLoading(true);
      try {
        const q = query(
          collection(db, "tasks"),
          where("groupId", "==", selectedGroupId),
          where("progress", "==", "Finished")
        );

        const querySnapshot = await getDocs(q);
        const tasks = querySnapshot.docs.map((doc) => doc.data());

        const userCounts = {};
        tasks.forEach((task) => {
          const user = task.finishedBy;
          if (user) {
            userCounts[user] = (userCounts[user] || 0) + 1;
          }
        });

        const sorted = Object.entries(userCounts)
          .map(([name, value]) => ({ name, value }))
          .sort((a, b) => a.value - b.value)
          .slice(-3); // show top 3

        setChartData(sorted);
      } catch (err) {
        console.error("Error fetching top finishers:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchTopFinishers();
  }, [selectedGroupId]);

  if (!selectedGroupId) return <p>Select a group to see the chart.</p>;
  if (loading) return <Spinner animation="border" />;
  if (chartData.length === 0) return <p>No finished tasks yet to show.</p>;

return (
  <div
    style={{
      padding: "1.5rem",
      background: "rgba(255,255,255, 0.05)",
      borderRadius: "0.75rem",
      height: "100%",
      backdropFilter: "blur(8px)",
      WebkitBackdropFilter: "blur(8px)",
      border: "1px solid rgba(255, 255, 255, 0.15)",
      boxShadow:
        "inset 0 0 0.5px rgba(255, 255, 255, 0.25), inset 0 0 5px rgba(255, 255, 255, 0.06), 0 8px 16px rgba(0, 0, 0, 0.4), 0 4px 6px rgba(255, 255, 255, 0.03)",
      color: "#f6f6f6",
      transition: "all 0.3s ease",
      cursor: "default"
    }}
  >
    <h1 style={{ color: "#f6f6f6", textAlign: "center" }} className="mb-3">
      Top 3
    </h1>
    <ResponsiveContainer
      width="100%"
      height={300}
      style={{ paddingRight: "3rem", marginTop: "2rem", height: "100%" }}
    >
      <BarChart data={chartData}>
        <XAxis dataKey="name" fontWeight={600} />
        <YAxis allowDecimals={false} />
        <Tooltip />
        <Bar dataKey="value" fill="#fa6000ff" radius={[5, 5, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  </div>
);
}

export default Graph;
