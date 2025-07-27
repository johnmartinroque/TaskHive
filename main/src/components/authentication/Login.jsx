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

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate("");

  const googleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;

      // Check if user doc already exists in Firestore
      const userDocRef = doc(db, "users", user.uid);
      const userDoc = await getDoc(userDocRef);

      if (!userDoc.exists()) {
        // 👇 Create user doc if it doesn't exist
        await setDoc(userDocRef, {
          uid: user.uid,
          name: user.displayName || "", // fallback if displayName is null
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
    <div className="d-flex justify-content-center mt-5">
      <div className="bg-white rounded p-4 shadow" style={{ width: "40rem" }}>
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

            {/* 🔸 Error message display */}
            {errorMessage && (
              <div className="alert alert-danger py-2">{errorMessage}</div>
            )}

            <div className="mb-3">
              <label htmlFor="email" className="form-label">
                Email address
              </label>
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                type="email"
                className="form-control"
                placeholder="name@example.com"
              />
            </div>
            <div className="mb-3">
              <label htmlFor="textarea" className="form-label">
                Password
              </label>
              <input
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="form-control"
                placeholder="Your password"
                type="password"
              />
            </div>
            <Button onClick={userLogin}>Log in</Button>
            <h4>Don't have an account?</h4>
            <Button onClick={() => navigate('/register')}>Register</Button>
          </Col>
        </Row>

        <div className="mt-3">
          <Button variant="outline-primary" onClick={googleLogin}>
            Login with Google
          </Button>
        </div>
      </div>
    </div>
  );
}

export default Login;
