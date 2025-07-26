import React, { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
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
    <div style={{ paddingTop: "1rem" }}>
      <h2 style={{ color: "#f6f6f6" }} className="mb-3">
        Top 3
      </h2>
      <ResponsiveContainer
        width="100%"
        height={300}
        style={{ paddingRight: "3rem", marginTop: "2rem", height: "100%" }}
      >
        <BarChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis allowDecimals={false} />
          <Tooltip />
          <Bar
            dataKey="value"
            fill="#82ca9d"
            label={{ position: "insideTop", fill: "#000" }}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export default Graph;
