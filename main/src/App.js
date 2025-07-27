import logo from "./logo.svg";
import "./App.css";
import Header from "./components/Header";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./screens/Home";
import "bootstrap-icons/font/bootstrap-icons.css";

import LoginPage from "./screens/LoginPage";
import RegisterPage from "./screens/RegisterPage";
import GroupDetailed from "./screens/GroupDetailed";
import Profile from "./screens/Profile";
import TaskDetailed from "./screens/TaskDetailed";
import ProtectedRoute from "./components/authentication/ProtectedRoute";
import LandingPage from "./components/authentication/LandingPage";
import Search from "./components/Search";
import CreateScreen from "./screens/CreateScreen";
import CalendarScreen from "./screens/CalendarScreen";

function App() {
  return (
    <div className="App">
      <Router>
        <Header />
        <div className="main-content">
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/landing" element={<LandingPage />} />
            {/* 🔒 Protected Routes */}
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <Home />
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              }
            />
            <Route
              path="/group/:groupId"
              element={
                <ProtectedRoute>
                  <GroupDetailed />
                </ProtectedRoute>
              }
            />
            <Route
              path="/tasks/:taskId"
              element={
                <ProtectedRoute>
                  <TaskDetailed />
                </ProtectedRoute>
              }
            />
            <Route
              path="/task"
              element={
                <ProtectedRoute>
                  <TaskDetailed />
                </ProtectedRoute>
              }
            />
            <Route
              path="/search"
              element={
                <ProtectedRoute>
                  <Search />
                </ProtectedRoute>
              }
            />
            <Route
              path="/calendar"
              element={
                <ProtectedRoute>
                  <CalendarScreen />
                </ProtectedRoute>
              }
            />
            <Route
              path="/createGroup"
              element={
                <ProtectedRoute>
                  <CreateScreen />
                </ProtectedRoute>
              }
            />
          </Routes>
        </div>
      </Router>
    </div>
  );
}

export default App;
