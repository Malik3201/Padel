import React, { useEffect, useState } from "react";
import OwnerCourtsList from "../components/owner/OwnerCourtsList";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:5001/api";

const OwnerDashboard = () => {
  const [courts, setCourts] = useState([]);
  const [bookings, setBookings] = useState([]);

  // ✅ Fetch courts
  const refreshCourts = async () => {
    try {
      const res = await fetch(`${API_BASE}/courts`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      });
      const data = await res.json();
      setCourts(data);
    } catch (err) {
      console.error("❌ Error fetching courts:", err);
    }
  };

  // ✅ Fetch bookings
  const refreshBookings = async () => {
    try {
      const res = await fetch(`${API_BASE}/bookings/my-bookings`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      });
      const data = await res.json();
      setBookings(data);
    } catch (err) {
      console.error("❌ Error fetching bookings:", err);
    }
  };

  // ✅ Edit court
  const handleEdit = async (updatedCourt) => {
    try {
      await fetch(`${API_BASE}/courts/${updatedCourt.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
        body: JSON.stringify(updatedCourt),
      });
      await refreshCourts();
    } catch (err) {
      console.error("❌ Edit error:", err);
    }
  };

  // ✅ Delete court
  const handleDelete = async (id) => {
    try {
      await fetch(`${API_BASE}/courts/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      });
      await refreshCourts();
    } catch (err) {
      console.error("❌ Delete error:", err);
    }
  };

  // ✅ Page load pe dono fetch
  useEffect(() => {
    refreshCourts();
    refreshBookings();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-white mb-6">🏟 My Courts & Bookings</h1>

      <OwnerCourtsList
        courts={courts}
        bookings={bookings}
        refreshCourts={refreshCourts}
        handleEdit={handleEdit}
        handleDelete={handleDelete}
      />
    </div>
  );
};

export default OwnerDashboard;
