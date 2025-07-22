import React, { useEffect } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Medicines from "./pages/Medicines";
import UpdateProfile from "./pages/UpdateProfile";

import { requestForToken, onMessageListener } from "./firebase-config";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  const navigate = useNavigate();

  useEffect(() => {
    if ("Notification" in window) {
      Notification.requestPermission().then((permission) => {
        if (permission === "granted") {
          console.log("✅ Notification permission granted.");

          const token = localStorage.getItem("token");
          if (token) {
            requestForToken(token); // Pass token to backend
          } else {
            console.warn("⚠️ JWT token not found in localStorage.");
          }
        } else {
          console.warn("🚫 Notification permission denied by user.");
        }
      });
    }

    // Handle foreground FCM notifications
    onMessageListener()
      .then((payload) => {
        console.log("📩 Foreground Notification received:", payload);
        const { title, body } = payload?.notification || {};

        if (title && body) {
          toast.info(`${title}: ${body}`, {
            position: "top-center",
            autoClose: 4000,
            theme: "dark",
          });

          // Optional: Visual browser notification fallback
          if (Notification.permission === "granted") {
            new Notification(title, {
              body,
              icon: "/vite.svg", // Replace with your app icon
            });
          }
        }
      })
      .catch((err) => console.error("❌ Error receiving FCM message:", err));
  }, []);

  return (
    <>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/medicines" element={<Medicines />} />
        <Route path="/profile" element={<UpdateProfile />} />
      </Routes>

      {/* Toast notification UI container */}
      <ToastContainer />
    </>
  );
}

export default App;
