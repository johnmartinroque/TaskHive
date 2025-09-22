import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Button, Spinner } from "react-bootstrap";
import Tasks from "../components/task/Tasks";
import Groups from "../components/group/Groups";
import MyGroups from "../components/group/MyGroups";
import Graph from "../components/group/graph/Graph";
import "../src_css/screens/Home.css";
import Invitations from "../components/authentication/Invitations";

function Home() {
  const [selectedGroupId, setSelectedGroupId] = useState(null);
  const [selectedGroupName, setSelectedGroupName] = useState("");

  return (
    <div id="home">
      <div className="left-side">
        <div className="top-left">
          <Tasks
            selectedGroupId={selectedGroupId}
            setSelectedGroupId={setSelectedGroupId}
            setSelectedGroupName={setSelectedGroupName}
          />
        </div>
        <div className="bottom-left">
          <MyGroups />
        </div>
      </div>

      <div className="right-side">
        {selectedGroupName ? (
          <h1 className="mb-3">Top 3 in Group {selectedGroupName}</h1>
        ) : (
          <Spinner animation="border" />
        )}
        {selectedGroupId ? (
          <Link
            to={`/group/${selectedGroupId}`}
            className="text-decoration-none text-dark"
          >
            <div>
              <Graph selectedGroupId={selectedGroupId} />
            </div>
          </Link>
        ) : (
          <>
            <p>Please select a group to view the graph.</p>
          </>
        )}
        <Invitations />
        <div className="footer">
          <h1 className="mb-3">TaskHive</h1>
          <h4>Collaboration by Roque and Manese</h4>
        </div>
      </div>
    </div>
  );
}

export default Home;
