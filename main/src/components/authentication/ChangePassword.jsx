import React, { useState } from "react";
import { auth } from "../../firebase";
import {
  EmailAuthProvider,
  reauthenticateWithCredential,
  updatePassword,
} from "firebase/auth";
import { Button, Col, Row } from "react-bootstrap";

function ChangePassword() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
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
      // Re-authenticate user with current credentials
      await reauthenticateWithCredential(user, credential);

      // Update to new password
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
    <div className="d-flex justify-content-center mt-5">
      <div className="rounded p-4 shadow" style={{ width: "40rem", backgroundColor:"#393939" }}>
        <Row>
          <Col>
            <h1 style={{fontWeight: "600"}}>Change Password</h1>
            <div className="mb-3">
              <label className="form-label">Current Password</label>
              <input
                style={{
                borderRadius: "10rem",
                border: "none",
                padding: "1rem",
                backgroundColor: "#1f1f1f"
                }}
                type="password"
                className="form-control"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="Change Password"
              />
            </div>
            <div className="mb-3">
              <label className="form-label">New Password</label>
              <input
                style={{
                borderRadius: "10rem",
                border: "none",
                padding: "1rem",
                backgroundColor: "#1f1f1f"
                }}
                type="password"
                className="form-control"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="New Password"
              />
            </div>
            <Button style={{padding:".7rem", marginTop:'1rem'}} onClick={handleChangePassword}>Change Password</Button>
            {message && <p className="mt-2 text-danger">{message}</p>}
          </Col>
        </Row>
      </div>
    </div>
  );
}

export default ChangePassword;
