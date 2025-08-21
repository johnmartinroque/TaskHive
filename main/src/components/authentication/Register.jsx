import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import React, { useState } from "react";
import { auth, db } from "../../firebase";
import { Button, Col, Row, Spinner } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { doc, serverTimestamp, setDoc } from "firebase/firestore";

function Register() {
  const [name, setName] = useState(""); // 👈 name input
  const [email, setEmail] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate("");
  const registerUser = async () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    // ✅ Check if email format is valid
    if (!emailRegex.test(email)) {
      setErrorMessage("Invalid email format");
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage("Passwords do not match");
      return;
    }
    try {
      const result = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = result.user;

      // 👇 Update displayName in Firebase Auth
      await updateProfile(user, {
        displayName: name,
      });

      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        name: name,
        email: email,
        createdAt: serverTimestamp(),
      });

      setEmail("");
      setPassword("");
      setName("");
      setErrorMessage("Registered");
      navigate("/");
      setLoading(true);
    } catch (err) {
      console.error(err);
      if (err.code === "auth/email-already-in-use") {
        setErrorMessage("Email already in use");
      } else if (err.code === "auth/weak-password") {
        setErrorMessage("Password should be at least 6 characters");
      } else {
        setErrorMessage("Registration failed");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="d-flex justify-content-center mt-5">
      <div id="login">
        <Row>
          <Col>
            {loading ? (
              <>
                <Spinner />
              </>
            ) : (
              <></>
            )}
            <h1>Register</h1>
            {errorMessage && (
              <div style={{borderRadius:"3rem", marginTop:"-1.5rem", fontWeight:"600"}} className="alert alert-danger mb-4">{errorMessage}</div>
            )}
            
            <div className="mb-3">
              <label className="form-label">
                <h3>Full Name</h3>
              </label>
              <input
                id="container"
                type="text"
                className="form-control"
                value={name}
                onChange={(e) => setName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    registerUser();
                  }
                }}
                placeholder="Enter your name"
              />
            </div>
            <div className="mb-3">
              <label className="form-label">
                <h3>Email Address</h3>
              </label>
              <input
                id="container"
                type="email"
                className="form-control"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    registerUser();
                  }
                }}
                placeholder="name@example.com"
              />
            </div>
            <div className="mb-3 position-relative">
              <label className="form-label">
                <h3>Password</h3>
              </label>
              <input
                id="container"
                type={showPassword ? "text" : "password"}
                className="form-control"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    registerUser();
                  }
                }}
                placeholder="Your password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: "absolute",
                  right: "4%",
                  top: "62%",
                  background: "none",
                  border: "none",
                  color: "#f6f6f6",
                  cursor: "pointer",
                  boxShadow: "none",
                }}
              >
                <i className={`bi ${showPassword ? "bi-eye-fill" : "bi-eye-slash-fill"}`}></i>
              </button>
            </div>

            <div className="mb-3 position-relative">
              <label className="form-label">
                <h3>Confirm Password</h3>
              </label>
              <input
                id="container"
                type={showConfirmPassword ? "text" : "password"}
                className="form-control"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    registerUser();
                  }
                }}
                placeholder="Confirm password"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                style={{
                  position: "absolute",
                  right: "4%",
                  top: "62%",
                  background: "none",
                  border: "none",
                  color: "#f6f6f6",
                  cursor: "pointer",
                  boxShadow: "none",
                }}
              >
                <i className={`bi ${showConfirmPassword ? "bi-eye-fill" : "bi-eye-slash-fill"}`}></i>
              </button>
            </div>

            <button id="main-way" onClick={registerUser}>
              <strong>Register</strong>
            </button>
              <h4 style={{textAlign:"center", margin:"1rem"}}>Or</h4>
            <button id="other-way" onClick={() => navigate('/login')}>
              <strong>Login</strong>
            </button>
          </Col>
        </Row>
      </div>
    </div>
  );
}

export default Register;
