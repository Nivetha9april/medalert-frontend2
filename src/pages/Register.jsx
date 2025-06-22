import React, { useState, useEffect } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
import "./Register.css";
import medBg from "../assets/medbg.jpg";

const Register = () => {
  const [form, setForm] = useState({ name: "", email: "", phone: "", password: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    // ✅ Google Sign-In for Register
    if (window.google) {
      google.accounts.id.initialize({
        client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
        callback: handleGoogleResponse,
      });

      google.accounts.id.renderButton(document.getElementById("googleRegister"), {
        theme: "outline",
        size: "large",
        width: "300px",
      });
    }
  }, []);

  const handleGoogleResponse = async (response) => {
    try {
      const decoded = jwtDecode(response.credential);
      const res = await axios.post("https://medalert-backend2.onrender.com/api/users/google-login", {
        name: decoded.name,
        email: decoded.email,
        password: decoded.sub,
        phone: "0000000000",
      });

      localStorage.setItem("token", res.data.token);
      alert("✅ Google Registration Successful");
      navigate("/medicines");
    } catch (err) {
      setError("Google registration failed");
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    setError("");
    if (!form.name || !form.email || !form.phone || !form.password) {
      setError("Please fill in all fields.");
      return;
    }
    try {
      await axios.post("https://medalert-backend2.onrender.com/api/users/register", form);
      alert("✅ Registration successful");
      navigate("/login");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="register-container">
      <form className="register-form" onSubmit={(e) => e.preventDefault()}>
        <h2>📝 MedAlert Sign Up</h2>
        {error && <p className="error">{error}</p>}

        <input type="text" name="name" placeholder="Full Name" value={form.name} onChange={handleChange} />
        <input type="email" name="email" placeholder="Email" value={form.email} onChange={handleChange} />
        <input type="tel" name="phone" placeholder="Phone (+91...)" value={form.phone} onChange={handleChange} />
        <input type="password" name="password" placeholder="Password" value={form.password} onChange={handleChange} />
        <button onClick={handleSubmit}>Register</button>

        <div id="googleRegister" style={{ marginTop: "10px" }}></div>

        <p>
          Already have an account? <a href="/login">Login here</a>
        </p>
      </form>
    </div>
  );
};

export default Register;
