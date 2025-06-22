// src/App.jsx
import React, { useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Medicines from "./pages/Medicines";
import UpdateProfile from "./pages/UpdateProfile";

function App() {
  useEffect(() => {
    if ("Notification" in window) {
      Notification.requestPermission();
    }
  }, []);

  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/medicines" element={<Medicines />} />
      <Route path="/profile" element={<UpdateProfile />} />
    </Routes>
  );
}

export default App;
