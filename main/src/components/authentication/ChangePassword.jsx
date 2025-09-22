import React, { useState } from "react";
import { auth } from "../../firebase";
import {
  EmailAuthProvider,
  reauthenticateWithCredential,
  updatePassword,
} from "firebase/auth";
import { Col, Row } from "react-bootstrap";

function ChangePassword() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [message, setMessage] = useState("");

  const handleChangePassword = async () => {
    const user = auth.currentUser;

    if (!user) {
      setMessage("No user is currently logged in.");
      return;
    }

    const credential = EmailAuthProvider.credential(
      user.email,
      currentPassword
    );

    try {
      await reauthenticateWithCredential(user, credential);
      await updatePassword(user, newPassword);
      setMessage("Password updated successfully.");
      setCurrentPassword("");
      setNewPassword("");
    } catch (error) {
      console.error(error);
      if (error.code === "auth/wrong-password") {
        setMessage("Current password is incorrect.");
      } else if (error.code === "auth/weak-password") {
        setMessage("New password is too weak.");
      } else {
        setMessage("Error: " + error.message);
      }
    }
  };

  return (
    <div className="container-fluid d-flex justify-content-center mt-5 px-3">
      <div
        id="login"
      >
        <Row>
          <Col>
            <h1 style={{ fontWeight: "600" }}>Change Password</h1>

            {/* Current Password */}
            <div className="mb-3 position-relative">
              <p style={{ color: "white" }} className="form-label">
                Current Password
              </p>
              <input
                type={showCurrentPassword ? "text" : "password"}
                className="form-control"
                placeholder="Current Password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                id="container"
              />
              <button
                type="button"
                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                style={{
                  position: "absolute",
                  right: "4%",
                  top: "53%",
                  background: "none",
                  border: "none",
                  color: "#f6f6f6",
                  cursor: "pointer",
                  boxShadow:"none"
                }}
              >
                <i
                  className={`bi ${
                    showCurrentPassword ? "bi-eye-fill" : "bi-eye-slash-fill"
                  }`}
                ></i>
              </button>
            </div>

            {/* New Password */}
            <div className="mb-3 position-relative">
              <p style={{ color: "white" }} className="form-label">
                New Password
              </p>
              <input
                type={showNewPassword ? "text" : "password"}
                className="form-control"
                placeholder="New Password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                id="container"
              />
              <button
                type="button"
                onClick={() => setShowNewPassword(!showNewPassword)}
                style={{
                  position: "absolute",
                  right: "4%",
                  top: "53%",
                  background: "none",
                  border: "none",
                  color: "#f6f6f6",
                  cursor: "pointer",
                  boxShadow:"none"
                }}
              >
                <i
                  className={`bi ${
                    showNewPassword ? "bi-eye-fill" : "bi-eye-slash-fill"
                  }`}
                ></i>
              </button>
            </div>

            <button id="main-way" onClick={handleChangePassword}>
              Change Password
            </button>

            {message && <p className="mt-2 text-danger">{message}</p>}
          </Col>
        </Row>
      </div>
    </div>
  );
}

export default ChangePassword;
