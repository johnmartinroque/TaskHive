import React, { useState } from "react";
import Chat from "../group/chat/Chat";
import HiveTaskLogo from "../HiveTaskLogo.png";
import "../../src_css/components/authentication/LandingPage.css";

function LandingPage() {
  const [button, setButton] = useState(true);

  const click = () => {
    if (button) {
      setButton(false);
    } else {
      setButton(true);
    }
  };
  return (
    <div style={{ justifyContent: "center", display: "flex", flexDirection: "column", alignItems: "center" }}>
      <img src={HiveTaskLogo} alt="HiveTask Logo" id="LandingLogo" />
      <h2 className="fade-up">TaskHive is a collaborative to-do list app built for groups—whether families, friends, classmates, or coworkers. Tasks can be created, assigned, marked complete, and discussed in real time.</h2>
    </div>
  );
}

export default LandingPage;
