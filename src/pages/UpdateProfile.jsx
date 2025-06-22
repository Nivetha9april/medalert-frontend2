import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Profile.css";

const UpdateProfile = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
  });

  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");

  // ✅ Fetch current user data when component mounts
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/users/me", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setForm(res.data);
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
        "http://localhost:5000/api/users/updateProfile",
        form,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      alert(res.data.message || "✅ Profile updated successfully");
    } catch (err) {
      alert("❌ Update failed: " + (err.response?.data?.message || "Server error"));
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="profile-container">
      <h2>📝 Update Profile</h2>
      <input name="name" value={form.name} onChange={handleChange} placeholder="Name" />
      <input name="email" value={form.email} onChange={handleChange} placeholder="Email" />
      <input name="phone" value={form.phone} onChange={handleChange} placeholder="Phone" />
      <input name="password" type="password" value={form.password} onChange={handleChange} placeholder="New Password" />
      <button onClick={updateProfile}>Update</button>
    </div>
  );
};

export default UpdateProfile;
