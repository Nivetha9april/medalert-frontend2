import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Dashboard.css";

const Dashboard = () => {
  const [meds, setMeds] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMeds = async () => {
      try {
        const res = await axios.get("https://medalert-backend2.onrender.com/api/medicines");
        setMeds(res.data);
      } catch (err) {
        console.error("Error loading medicine summary:", err);
      }
    };
    fetchMeds();
  }, []);

  const totalMeds = meds.length;
  const expiringSoon = meds.filter((m) => {
    const exp = new Date(m.expiryDate);
    const now = new Date();
    const diff = (exp - now) / (1000 * 60 * 60 * 24);
    return diff < 7;
  });

  return (
    <div className="dashboard-container">
      <h1>MedAlert Dashboard</h1>

      <div className="summary-cards">
        <div className="card">
          <h2>Total Medicines</h2>
          <p>{totalMeds}</p>
        </div>

        <div className="card warning">
          <h2>Expiring Soon</h2>
          <p>{expiringSoon.length}</p>
        </div>
      </div>

      <div className="actions">
        <button onClick={() => navigate("/medicines")}>View Medicines</button>
        <button onClick={() => navigate("/add")}>Add Medicine</button>
        <button onClick={() => navigate("/profile")}>Update Profile</button>
        <button onClick={() => navigate("/logout")}>Logout</button>
      </div>
    </div>
  );
};

export default Dashboard;
