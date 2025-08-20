import React, { useState } from "react";
import Chat from "../group/chat/Chat";
import { useNavigate } from "react-router-dom";
import HiveTaskLogo from "../HiveTaskLogo.png";
import "../../src_css/components/authentication/LandingPage.css";
import { Col, Row } from "react-bootstrap";

function LandingPage() {
  const [button, setButton] = useState(true);
    const navigate = useNavigate("");

  const click = () => {
    if (button) {
      setButton(false);
    } else {
      setButton(true);
    }
  };
  return (
    <div className="landing-container">
      <img src={HiveTaskLogo} alt="HiveTask Logo" id="LandingLogo" />
      
      <Row>
      <Col>
        <button id="land-button" onClick={() => navigate("/login")}>
          <strong>Log in </strong>
        </button>
      </Col>
      <Col>
      <button id="land-button" onClick={() => navigate("/register")}>
        <strong>Sign up </strong>
      </button>
      </Col>
      </Row>
      {/* <h2 className="fade-up">TaskHive is a collaborative to-do list app built for groups—whether families, friends, classmates, or coworkers. Tasks can be created, assigned, marked complete, and discussed in real time.</h2> */}
    </div>
  );
}

export default LandingPage;
