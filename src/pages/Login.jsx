import React, { useState, useEffect } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
import "./Login.css";
import medBg from "../assets/medbg.jpg";

const Login = () => {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // ✅ Google Login Handler
  const handleGoogleResponse = async (response) => {
    try {
      const decoded = jwtDecode(response.credential);
      const res = await axios.post(
        "https://medalert-backend-3-production.up.railway.app/api/users/google-login",
        {
          name: decoded.name,
          email: decoded.email,
          password: decoded.sub, // fallback password
          phone: "0000000000",
        }
      );

      localStorage.setItem("token", res.data.token);
      alert("✅ Google Login Successful");
      navigate("/medicines");
    } catch (err) {
      console.error("❌ Google Login Failed:", err);
      setError("Google login failed. Please try again.");
    }
  };

  // ✅ Initialize Google Button when script is loaded
  useEffect(() => {
    const googleInit = () => {
      if (window.google && document.getElementById("googleSignIn")) {
        window.google.accounts.id.initialize({
          client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
          callback: handleGoogleResponse,
        });

        window.google.accounts.id.renderButton(
          document.getElementById("googleSignIn"),
          {
            theme: "outline",
            size: "large",
            width: "300px",
          }
        );
      }
    };

    if (document.readyState === "complete") {
      googleInit();
    } else {
      window.addEventListener("load", googleInit);
    }

    return () => window.removeEventListener("load", googleInit);
  }, []);

  // ✅ Manual login
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!form.email || !form.password) {
      setError("Please fill all fields.");
      return;
    }

    try {
      const res = await axios.post(
        "https://medalert-backend-3-production.up.railway.app/api/users/login",
        form
      );
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("userId", res.data.user._id);
      alert("✅ Login Successful");
      navigate("/medicines");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div
      className="login-container"
      style={{
        backgroundImage: `url(${medBg})`,
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <form onSubmit={handleSubmit} className="login-box">
        <h2>🔐 MedAlert Login</h2>
        {error && <p className="error">{error}</p>}

        <input
          type="email"
          name="email"
          placeholder="📧 Email"
          value={form.email}
          onChange={handleChange}
        />
        <input
          type="password"
          name="password"
          placeholder="🔒 Password"
          value={form.password}
          onChange={handleChange}
        />
        <button type="submit">Login</button>

        <div
          id="googleSignIn"
          style={{ marginTop: "15px", display: "flex", justifyContent: "center" }}
        ></div>

        <p style={{ marginTop: "20px" }}>
          Don’t have an account?{" "}
          <span
            style={{ color: "#2b6cb0", cursor: "pointer" }}
            onClick={() => navigate("/register")}
          >
            Register here
          </span>
        </p>
      </form>
    </div>
  );
};

export default Login;
