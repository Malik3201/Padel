import React, { useState, useEffect } from "react";
import Navigation from "@/components/Navigation";
import api from "@/axiosInstense";

const OrganizerDashboard = () => {
  const [tournaments, setTournaments] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    location: "",
    startDate: "",
    entryFee: "",
    skillLevel: "Beginner",
  });
  const [errorMessage, setErrorMessage] = useState("");

  // ✅ Fetch tournaments
  const fetchMyTournaments = async () => {
    try {
      setIsLoading(true);
      const response = await api.get("/tournaments/organizer/my-tournaments");
      setTournaments(
        Array.isArray(response.data.tournaments)
          ? response.data.tournaments
          : []
      );
    } catch (err) {
      console.error("Error fetching tournaments", err);
      setTournaments([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMyTournaments();
  }, []);

  // ✅ Add/Edit tournament
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");

    if (
      !formData.title ||
      !formData.location ||
      !formData.startDate ||
      !formData.entryFee
    ) {
      setErrorMessage("Please fill in all required fields.");
      return;
    }

    try {
      setIsLoading(true);
      let response;
      if (isEditing) {
        response = await api.put(`/tournaments/${editingId}`, formData);
        setTournaments((prev) =>
          prev.map((t) => (t._id === editingId ? response.data.data : t))
        );
      } else {
        response = await api.post("/tournaments", formData);
        if (response.data.data) {
          setTournaments((prev) => [...prev, response.data.data]);
        } else {
          fetchMyTournaments();
        }
      }

      setFormData({
        title: "",
        location: "",
        startDate: "",
        entryFee: "",
        skillLevel: "Beginner",
      });
      setIsEditing(false);
      setEditingId(null);
    } catch (err) {
      setErrorMessage(err.response?.data?.message || "Error saving tournament");
    } finally {
      setIsLoading(false);
    }
  };

  // ✅ Delete
  const handleDelete = async (id) => {
    try {
      setIsLoading(true);
      await api.delete(`/tournaments/${id}`);
      setTournaments((prev) => prev.filter((t) => t._id !== id));
    } catch (err) {
      console.error("Error deleting tournament", err);
    } finally {
      setIsLoading(false);
    }
  };

  // ✅ Edit
  const handleEdit = (tournament) => {
    setIsEditing(true);
    setEditingId(tournament._id);
    setFormData({
      title: tournament.title || "",
      location: tournament.location || "",
      startDate: tournament.startDate
        ? new Date(tournament.startDate).toISOString().split("T")[0]
        : "",
      entryFee: tournament.entryFee || "",
      skillLevel: tournament.skillLevel || "Beginner",
    });
    setErrorMessage("");
  };

  return (
    <div className="min-h-screen bg-gradient-to-t from-[#010e1f] to-[#021835] flex flex-col items-center py-10 px-4">
      <Navigation />
      <br />
      <br />
      <h1 className="text-3xl font-bold mb-8 text-white">
        Organizer Dashboard
      </h1>

      {errorMessage && (
        <div className="bg-red-600 text-white p-3 rounded mb-4 max-w-2xl w-full text-center">
          {errorMessage}
        </div>
      )}

      {/* Loading Overlay */}
      {isLoading && (
        <div className="fixed top-0 left-0 w-full h-full bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-4 rounded-lg shadow-lg">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
            <p className="mt-2 text-gray-700">Loading...</p>
          </div>
        </div>
      )}

      {/* Form */}
      <div className="bg-white/30 shadow-lg rounded-2xl p-8 w-full max-w-2xl mb-10">
        <h2 className="text-2xl font-semibold mb-6 text-gray-800">
          {isEditing ? "Edit Tournament" : "Add New Tournament"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Tournament Title"
            value={formData.title}
            onChange={(e) =>
              setFormData({ ...formData, title: e.target.value })
            }
            className="border border-gray-300 rounded-lg p-3 w-full text-black placeholder-gray-500"
            required
          />
          <input
            type="text"
            placeholder="Location"
            value={formData.location}
            onChange={(e) =>
              setFormData({ ...formData, location: e.target.value })
            }
            className="border border-gray-300 rounded-lg p-3 w-full text-black placeholder-gray-500"
            required
          />
          <input
            type="date"
            value={formData.startDate}
            onChange={(e) =>
              setFormData({ ...formData, startDate: e.target.value })
            }
            className="border border-gray-300 rounded-lg p-3 w-full text-black"
            required
          />
          <input
            type="number"
            placeholder="Entry Fee"
            value={formData.entryFee}
            onChange={(e) =>
              setFormData({ ...formData, entryFee: e.target.value })
            }
            className="border border-gray-300 rounded-lg p-3 w-full text-black placeholder-gray-500"
            required
          />
          <select
            value={formData.skillLevel}
            onChange={(e) =>
              setFormData({ ...formData, skillLevel: e.target.value })
            }
            className="border border-gray-300 rounded-lg p-3 w-full text-black"
          >
            <option value="Beginner">Beginner</option>
            <option value="Intermediate">Intermediate</option>
            <option value="Advanced">Advanced</option>
          </select>

          <div className="flex space-x-4">
            <button
              type="submit"
              className="bg-green-600 hover:bg-green-700 transition text-white px-6 py-3 rounded-lg flex-1 font-semibold shadow-md"
              disabled={isLoading}
            >
              {isLoading
                ? isEditing
                  ? "Updating..."
                  : "Adding..."
                : isEditing
                ? "Update Tournament"
                : "Add Tournament"}
            </button>
            {isEditing && (
              <button
                type="button"
                onClick={() => {
                  setIsEditing(false);
                  setEditingId(null);
                  setFormData({
                    title: "",
                    location: "",
                    startDate: "",
                    entryFee: "",
                    skillLevel: "Beginner",
                  });
                  setErrorMessage("");
                }}
                className="bg-gray-500 hover:bg-gray-600 transition text-white px-6 py-3 rounded-lg font-semibold shadow-md"
                disabled={isLoading}
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Tournament List */}
      <div className="w-full max-w-5xl bg-white shadow-lg rounded-xl p-6">
        <h2 className="text-2xl font-semibold mb-4 text-gray-800">
          My Tournaments
        </h2>
        {tournaments.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse border border-gray-200">
              <thead>
                <tr className="bg-gray-100 text-left">
                  <th className="border border-gray-200 p-3">Title</th>
                  <th className="border border-gray-200 p-3">Location</th>
                  <th className="border border-gray-200 p-3">Start Date</th>
                  <th className="border border-gray-200 p-3">Entry Fee</th>
                  <th className="border border-gray-200 p-3">Skill Level</th>
                  <th className="border border-gray-200 p-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {tournaments.map((t) => (
                  <tr key={t._id} className="hover:bg-gray-50">
                    <td className="border border-gray-200 p-3">{t.title}</td>
                    <td className="border border-gray-200 p-3">{t.location}</td>
                    <td className="border border-gray-200 p-3">
                      {t.startDate
                        ? new Date(t.startDate).toLocaleDateString()
                        : "N/A"}
                    </td>
                    <td className="border border-gray-200 p-3">
                      {t.entryFee}
                    </td>
                    <td className="border border-gray-200 p-3">
                      {t.skillLevel}
                    </td>
                    <td className="border border-gray-200 p-3 space-x-2">
                      <button
                        onClick={() => handleEdit(t)}
                        className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded"
                        disabled={isLoading}
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(t._id)}
                        className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
                        disabled={isLoading}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-gray-500">
            {isLoading
              ? "Loading tournaments..."
              : "No tournaments found."}
          </p>
        )}
      </div>
    </div>
  );
};

export default OrganizerDashboard;
