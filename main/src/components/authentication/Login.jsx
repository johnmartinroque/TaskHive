import React, { useState } from "react";
import { Button, Col, Row, Spinner } from "react-bootstrap";
import { auth, db, googleProvider } from "../../firebase";
import {
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
} from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { doc, getDoc, serverTimestamp, setDoc } from "firebase/firestore";
import "../../src_css/components/authentication/Login.css";
function Login() {
  const [email, setEmail] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate("");

  const googleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;

      const userDocRef = doc(db, "users", user.uid);
      const userDoc = await getDoc(userDocRef);

      if (!userDoc.exists()) {
        await setDoc(userDocRef, {
          uid: user.uid,
          name: user.displayName || "",
          email: user.email,
          createdAt: serverTimestamp(),
        });
      }

      localStorage.setItem("userEmail", user.email);
      setLoading(true);
      navigate("/");
    } catch (err) {
      console.error(err);
      setErrorMessage("Google login failed.");
    } finally {
      setLoading(false);
    }
  };

  const userLogin = async () => {
    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      const user = result.user;
      localStorage.setItem("userEmail", user.email);
      navigate("/");
    } catch (err) {
      console.error(err);
      // 🔸 Display user-friendly error messages
      switch (err.code) {
        case "auth/invalid-email":
          setErrorMessage("Invalid email format.");
          break;
        case "auth/invalid-credential":
          setErrorMessage("Incorrect Email or Password");
          break;
        default:
          setErrorMessage("Login failed. Please try again.");
          break;
      }
    }
  };

  const logoutUser = async () => {
    try {
      await signOut(auth);
      localStorage.removeItem("userEmail");
      navigate("/");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="d-flex justify-content-center">
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
            <h1>Login</h1>
            {errorMessage && (
              <div
                style={{ borderRadius: "3rem", marginTop: "-1.5rem" }}
                className="alert alert-danger mb-4"
              >
                {errorMessage}
              </div>
            )}

            <div className="mb-3">
              <label htmlFor="email" className="form-label">
                <h3>Email Address</h3>
              </label>
              <input
                id="container"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    userLogin();
                  }
                }}
                type="email"
                className="form-control"
                placeholder="name@example.com"
              />
            </div>
            <div className="mb-3 position-relative">
              <label htmlFor="password" className="form-label">
                <h3>Password</h3>
              </label>
              <input
                id="container"
                type={showPassword ? "text" : "password"}
                className="form-control"
                placeholder="Your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    userLogin();
                  }
                }}
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

            <button id="main-way" onClick={userLogin}>
              <strong>Log in </strong>
            </button>
            <h4 style={{ textAlign: "center", margin: "1rem" }}>Or</h4>
            <button id="main-way" onClick={googleLogin}>
              <strong>Log in with Google</strong>
            </button>
            <button id="other-way" onClick={() => navigate("/register")}>
              <strong>Register</strong>
            </button>
          </Col>
        </Row>
      </div>
    </div>
  );
}

export default Login;
