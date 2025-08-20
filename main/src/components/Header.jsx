import { signOut, onAuthStateChanged } from "firebase/auth";
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { auth } from "../firebase";
import "../src_css/components/Header.css";
import HiveTaskLogo from "./HiveTaskLogo.png";
import UserAvatar from "./authentication/UserAvatar";

function Header() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    return () => unsubscribe(); // Cleanup listener on unmount
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/landing");
      alert("Successfully logged out");
    } catch (err) {
      console.error("Logout error:", err);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchTerm.trim())}`);
      setSearchTerm("");
    }
  };

  return (
    <div>
      <nav className="navbar navbar-expand-lg bg-body-tertiary" id="nav">
        <div className="container-fluid" style={{backgroundColor:"black"}}>
          <Link to="/" className="navbar-brand">
            <img src={HiveTaskLogo} alt="HiveTask Logo" id="Logo" />
          </Link>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarSupportedContent"
            aria-controls="navbarSupportedContent"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <ul className="navbar-nav">
              <li className="nav-item">
                <Link to="/" className="nav-link active" aria-current="page">
                  Home
                </Link>
              </li>

              {user && (
                <form
                  className="search-form d-flex"
                  role="search"
                  onSubmit={handleSearch}
                >
                  <button
                    className="btn btn-outline-success bi bi-search"
                    type="submit"
                    id="search-but"
                  ></button>
                  <input
                    id="search-form"
                    className={`form-control search-input ${
                      searchTerm ? "has-value" : ""
                    }`}
                    type="search"
                    placeholder="Search groups..."
                    aria-label="Search"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </form>
              )}
              {!user && (
                <li className="nav-item">
                  <Link to="/login" className="nav-link">
                    Login
                  </Link>
                </li>
              )}

              {user && (
              <ul className="navbar-nav me-auto mb-lg-0">
              <li className="desk-item">
                <Link to="/profile" className="nav-link active" aria-current="page">Profile</Link>
              </li>
              <li className="desk-item">
                <Link onClick={handleLogout} className="nav-link active" aria-current="page">Logout</Link>
              </li>
              <li className="desk-item">
                <Link to="/" className="nav-link active bi bi-activity" aria-current="page"></Link>
              </li>
              <li className="desk-item">
                <Link to="/calendar" className="nav-link active bi bi-calendar2-week" aria-current="page"></Link>
              </li>
              <li className="desk-item">
                <Link to="/" className="nav-link active bi bi-person-add" aria-current="page"></Link>
              </li>
              <li className="desk-item ">
                <Link to="/" className="nav-link active bi bi-gear" aria-current="page"></Link>
              </li>
              <li className="desk-item">
                <Link to="/createGroup" className="nav-link active bi bi-plus-lg" aria-current="page"></Link>
              </li>
            </ul>
            )}
            
              {user && (
                <li className="user-form">
                  <li className="user-list">
                    <Link
                      className="user-link"
                      href="#"
                      role="button"
                      data-bs-toggle="dropdown"
                      aria-expanded="false"
                    >
                      <h5>{user.displayName || user.email}</h5>
                      <UserAvatar size={55} />
                    </Link>
                    <ul className="dropdown-menu" id="draop">
                      <li>
                        <button className="dropdown-item" onClick={() => navigate('/profile')}>
                          Profile
                        </button>
                      </li>
                      <li>
                        <button className="dropdown-item" onClick={handleLogout}>
                          Logout
                        </button>
                      </li>
                    </ul>
                  </li>
                </li>
              )}
            </ul>
          </div>
        </div>
      </nav>
      <nav id="sidebar">
        <ul className="navbar-nav me-auto mb-2 mb-lg-0">
          <li className="nav-item">
            <Link to="/" className="nav-link active bi bi-activity" aria-current="page"></Link>
          </li>
          <li className="nav-item">
            <Link to="/calendar" className="nav-link active bi bi-calendar2-week" aria-current="page"></Link>
          </li>
          <li className="nav-item">
            <Link to="/" className="nav-link active bi bi-person-add" aria-current="page"></Link>
          </li>
          <li className="nav-item ">
            <Link to="/" className="nav-link active bi bi-gear" aria-current="page"></Link>
          </li>
          <li className="last-item">
            <Link to="/createGroup" className="nav-link active bi bi-plus-lg" aria-current="page"></Link>
          </li>
        </ul>
      </nav>
    </div>
  );
}

export default Header;
