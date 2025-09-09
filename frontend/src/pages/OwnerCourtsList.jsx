import React, { useState } from "react";
import api from "@/axiosInstense";

const OwnerCourtsList = ({ courts, bookings, refreshCourts, handleEdit, handleDelete }) => {
  const [editingCourt, setEditingCourt] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    location: "",
    pricePerHour: "",
  });

  const [newCourt, setNewCourt] = useState({
    name: "",
    location: "",
    pricePerHour: "",
    images: [],
  });

  // Start editing
  const startEdit = (court) => {
    setEditingCourt(court._id);
    setFormData({
      name: court.name,
      location: court.location,
      pricePerHour: court.pricePerHour,
    });
  };

  // Input changes (edit)
  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  // Save edit
  const saveEdit = async () => {
    await handleEdit({ id: editingCourt, ...formData });
    setEditingCourt(null);
  };

  // New court input change
  const handleNewCourtChange = (e) => {
    setNewCourt((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  // Image upload
  const handleImageChange = (e) => {
    setNewCourt((prev) => ({ ...prev, images: e.target.files }));
  };

  // Add new court
  const addCourt = async () => {
    try {
      const fd = new FormData();
      fd.append("name", newCourt.name);
      fd.append("location", newCourt.location);
      fd.append("pricePerHour", newCourt.pricePerHour);

      if (newCourt.images && newCourt.images.length > 0) {
        for (let i = 0; i < newCourt.images.length; i++) {
          fd.append("images", newCourt.images[i]);
        }
      }

      await api.post("/courts", fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setNewCourt({ name: "", location: "", pricePerHour: "", images: [] });
      await refreshCourts();
    } catch (err) {
      console.error("❌ Add court error:", err.message);
    }
  };

  return (
    <div className="space-y-6">
      {/* Add Court */}
      <div className="bg-gray-900 p-4 rounded-lg shadow">
        <h2 className="text-xl font-bold text-white mb-3">➕ Add New Court</h2>
        <div className="flex flex-col gap-3">
          <input
            type="text"
            name="name"
            value={newCourt.name}
            onChange={handleNewCourtChange}
            placeholder="Court Name"
            className="p-2 rounded text-black"
          />
          <input
            type="text"
            name="location"
            value={newCourt.location}
            onChange={handleNewCourtChange}
            placeholder="Location"
            className="p-2 rounded text-black"
          />
          <input
            type="number"
            name="pricePerHour"
            value={newCourt.pricePerHour}
            onChange={handleNewCourtChange}
            placeholder="Price per Hour"
            className="p-2 rounded text-black"
          />
          <input
            type="file"
            multiple
            onChange={handleImageChange}
            className="p-2 rounded bg-gray-200"
          />
          <button
            onClick={addCourt}
            className="bg-green-600 px-4 py-2 rounded hover:bg-green-700 text-white"
          >
            Add Court
          </button>
        </div>
      </div>

      {/* Courts List */}
      <div className="space-y-4">
        {courts.length === 0 ? (
          <p className="text-white">No courts found. Add your first court!</p>
        ) : (
          courts.map((court) => (
            <div
              key={court._id}
              className="bg-gray-800 text-white p-4 rounded-lg shadow flex justify-between items-center"
            >
              {editingCourt === court._id ? (
                <div className="flex flex-col gap-2 w-full">
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Court Name"
                    className="p-2 rounded text-black"
                  />
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    placeholder="Location"
                    className="p-2 rounded text-black"
                  />
                  <input
                    type="number"
                    name="pricePerHour"
                    value={formData.pricePerHour}
                    onChange={handleChange}
                    placeholder="Price per Hour"
                    className="p-2 rounded text-black"
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={saveEdit}
                      className="bg-green-600 px-4 py-2 rounded hover:bg-green-700"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => setEditingCourt(null)}
                      className="bg-gray-600 px-4 py-2 rounded hover:bg-gray-700"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <div>
                    <h2 className="text-lg font-bold">{court.name}</h2>
                    <p className="text-sm text-gray-300">{court.location}</p>
                    <p className="text-sm">💰 {court.pricePerHour} / hour</p>
                    {court.images?.length > 0 && (
                      <div className="flex gap-2 mt-2">
                        {court.images.map((img, idx) => (
                          <img
                            key={idx}
                            src={img}
                            alt="court"
                            className="w-20 h-20 object-cover rounded"
                          />
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => startEdit(court)}
                      className="bg-blue-600 px-4 py-2 rounded hover:bg-blue-700"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(court._id)}
                      className="bg-red-600 px-4 py-2 rounded hover:bg-red-700"
                    >
                      Delete
                    </button>
                  </div>
                </>
              )}
            </div>
          ))
        )}
      </div>

      {/* Bookings List */}
      <div className="mt-6">
        <h2 className="text-xl font-bold mb-2 text-white">📅 My Bookings</h2>
        {bookings.length === 0 ? (
          <p className="text-gray-400">No bookings yet.</p>
        ) : (
          <ul className="space-y-2">
            {bookings.map((b) => (
              <li
                key={b._id}
                className="bg-gray-700 p-3 rounded flex justify-between items-center"
              >
                <span>
                  🏟 {b.court?.name || "Court"} | 👤 {b.user?.name || "User"} | ⏰{" "}
                  {new Date(b.date).toLocaleString()}
                </span>
                <span
                  className={`px-3 py-1 rounded text-sm ${
                    b.status === "confirmed"
                      ? "bg-green-600"
                      : b.status === "pending"
                      ? "bg-yellow-600"
                      : "bg-red-600"
                  }`}
                >
                  {b.status}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default OwnerCourtsList;
