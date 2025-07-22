import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Profile.css";
import medBg from "../assets/medbg.jpg";

const UpdateProfile = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
  });

  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get("https://medalert-backend-3-production.up.railway.app/api/users/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setForm({ ...res.data, password: "" }); // don't pre-fill password
        setLoading(false);
      } catch (err) {
        alert("Failed to load profile");
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const updateProfile = async () => {
    try {
      const res = await axios.put(
        "https://medalert-backend-3-production.up.railway.app/api/users/updateProfile",
        form,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      alert(res.data.message || "✅ Profile updated successfully");
    } catch (err) {
      alert("❌ Update failed: " + (err.response?.data?.message || "Server error"));
    }
  };

  if (loading) return <div className="loading">Loading...</div>;

  return (
    <div
      className="profile-container"
      style={{
        backgroundImage: `url(${medBg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backdropFilter: "blur(3px)",
        padding: "1rem",
      }}
    >
      <div className="profile-box">
        <h2>📝 Update Profile</h2>
        <input name="name" value={form.name} onChange={handleChange} placeholder="Name" />
        <input name="email" value={form.email} onChange={handleChange} placeholder="Email" />
        <input name="phone" value={form.phone} onChange={handleChange} placeholder="Phone" />
        <input
          name="password"
          type="password"
          value={form.password}
          onChange={handleChange}
          placeholder="New Password"
        />
        <button onClick={updateProfile}>Update</button>
      </div>
    </div>
  );
};

export default UpdateProfile;
