import React, { useEffect, useState } from "react";
import axios from "axios";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { useNavigate } from "react-router-dom";
import "./Medicines.css";
import medBg from "../assets/medbg.jpg";

const Medicines = () => {
  const [meds, setMeds] = useState([]);
  const [form, setForm] = useState({
    name: "",
    dosage: "",
    quantity: "",
    frequency: "",
    startDate: "",
    expiryDate: "",
  });
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("name");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  // ✅ Fetch Medicines
  const fetchMeds = async () => {
    try {
      const res = await axios.get("https://medalert-backend2.onrender.com/api/medicines", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMeds(res.data);
    } catch (err) {
      console.error("❌ Fetch error:", err);
    }
  };

  // ✅ Notification Reminder Setup
  useEffect(() => {
  fetchMeds();

  // ✅ Ask for permission only if not yet granted or denied
  if ("Notification" in window && Notification.permission === "default") {
    Notification.requestPermission();
  }

  // ✅ MEDICINE REMINDER every 5 minutes
  const medReminderInterval = setInterval(() => {
    const now = new Date();
    const hour = now.getHours();

    // Trigger only at 9 AM, 2 PM, 9 PM
    if ([9, 14, 21].includes(hour)) {
      meds.forEach((med) => {
        const start = new Date(med.startDate);
        const expiry = new Date(med.expiryDate);
        if (now >= start && now <= expiry) {
          if (Notification.permission === "granted") {
            new Notification(`💊 Time to take ${med.name}`, {
              body: `Dosage: ${med.dosage}, Qty: ${med.quantity}`,
              icon: "/icon.png",
            });
          }
        }
      });
    }
  }, 5 * 60 * 1000); // every 5 minutes

  // ✅ RANDOM HEALTH NOTIFICATION every 1 hour
  const wellnessTips = [
    "💧 Stay hydrated! Drink a glass of water.",
    "🚶‍♀️ Stretch your legs and take a short walk.",
    "😌 Take a deep breath and relax for a minute.",
    "🍎 Time for a healthy snack break!",
    "🧠 Rest your eyes. Blink a few times!",
  ];

  const randomReminderInterval = setInterval(() => {
    if (Notification.permission === "granted") {
      const randomTip = wellnessTips[Math.floor(Math.random() * wellnessTips.length)];
      new Notification("🩺 Health Tip", {
        body: randomTip,
        icon: "/icon.png",
      });
    }
  }, 60 * 60 * 1000); // every 1 hour

  // ✅ Cleanup intervals when component unmounts
  return () => {
    clearInterval(medReminderInterval);
    clearInterval(randomReminderInterval);
  };
}, [meds]);


   

  const handleFormChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleAddMedicine = async (e) => {
    e.preventDefault();
    setError("");

    const { name, quantity, frequency, startDate, expiryDate } = form;
    if (!name || !quantity || !frequency || !startDate || !expiryDate) {
      setError("Please fill all fields.");
      return;
    }

    try {
      await axios.post("https://medalert-backend2.onrender.com/api/medicines", form, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("✅ Medicine added");
      setForm({
        name: "",
        dosage: "",
        quantity: "",
        frequency: "",
        startDate: "",
        expiryDate: "",
      });
      fetchMeds();
    } catch (err) {
      setError("Error adding medicine.");
    }
  };

  const generatePDF = () => {
    if (!meds.length) return alert("No data to export!");

    const doc = new jsPDF();
    doc.text("Your Medicine Report", 14, 16);
    autoTable(doc, {
      startY: 25,
      head: [["Name", "Dosage", "Qty", "Frequency", "Start Date", "Expiry"]],
      body: meds.map((m) => [
        m.name,
        m.dosage,
        m.quantity,
        m.frequency,
        new Date(m.startDate).toLocaleDateString(),
        new Date(m.expiryDate).toLocaleDateString(),
      ]),
    });

    doc.save("medicines.pdf");
  };

  const sortedMeds = [...meds]
    .filter((m) => m.name.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) =>
      sort === "name" ? a.name.localeCompare(b.name) : new Date(a[sort]) - new Date(b[sort])
    );

  return (
    <div
      className="medicine-container"
      style={{
        backgroundImage: `url(${medBg})`,
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
        backgroundPosition: "center",
        minHeight: "100vh",
        padding: "2rem",
      }}
    >
      <button onClick={() => navigate("/profile")}>👤 Update Profile</button>

      <h2>💊 Your Medicines</h2>

      <form className="add-medicine-form" onSubmit={handleAddMedicine}>
        <h3>Add New Medicine</h3>
        {error && <p className="error">{error}</p>}
        <input name="name" placeholder="Name" value={form.name} onChange={handleFormChange} />
        <input name="dosage" placeholder="Dosage" value={form.dosage} onChange={handleFormChange} />
        <input name="quantity" type="number" placeholder="Quantity" value={form.quantity} onChange={handleFormChange} />
        <input name="frequency" type="number" placeholder="Frequency (per day)" value={form.frequency} onChange={handleFormChange} />
        <input name="startDate" type="date" value={form.startDate} onChange={handleFormChange} />
        <input name="expiryDate" type="date" value={form.expiryDate} onChange={handleFormChange} />
        <button type="submit">➕ Add Medicine</button>
      </form>

      <input
        className="search-box"
        placeholder="Search medicines..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      <select className="sort-select" value={sort} onChange={(e) => setSort(e.target.value)}>
        <option value="name">Sort by Name</option>
        <option value="startDate">Start Date</option>
        <option value="expiryDate">Expiry Date</option>
      </select>

      <button onClick={generatePDF} className="export-btn">📄 Export to PDF</button>

      <div className="medicine-list">
        {sortedMeds.map((med) => (
          <div className="medicine-card" key={med._id}>
            <h3>{med.name}</h3>
            <p><b>Dosage:</b> {med.dosage}</p>
            <p><b>Qty:</b> {med.quantity}</p>
            <p><b>Freq:</b> {med.frequency}/day</p>
            <p><b>Start:</b> {new Date(med.startDate).toLocaleDateString()}</p>
            <p><b>Expiry:</b> {new Date(med.expiryDate).toLocaleDateString()}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Medicines;
