import React, { useState } from "react";
import { motion } from "framer-motion";
import Navigation from "@/components/Navigation";
import { Plus, Edit, Trash2, Users, Trophy, DollarSign, Target } from "lucide-react";

const TournamentManagement = () => {
  const [tournaments, setTournaments] = useState([
    {
      id: "1",
      name: "Summer Padel Cup",
      description: "Exciting summer tournament for all levels!",
      price: "2000",
      level: "Beginner",
      prizePool: "PKR 50,000",
    },
    {
      id: "2",
      name: "Pro Championship",
      description: "Advanced level players compete for big prizes.",
      price: "5000",
      level: "Advanced",
      prizePool: "PKR 150,000",
    },
  ]);

  const [registrations, setRegistrations] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [showRegistrations, setShowRegistrations] = useState(false);
  const [editingTournament, setEditingTournament] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    level: "Beginner",
    prizePool: "",
  });

  // input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // submit form
  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingTournament) {
      setTournaments((prev) =>
        prev.map((t) =>
          t.id === editingTournament.id ? { ...formData, id: t.id } : t
        )
      );
    } else {
      setTournaments((prev) => [
        ...prev,
        { ...formData, id: Date.now().toString() },
      ]);
    }
    resetForm();
  };

  const handleEdit = (tournament) => {
    setEditingTournament(tournament);
    setFormData(tournament);
    setShowForm(true);
  };

  const handleDelete = (id) => {
    setTournaments((prev) => prev.filter((t) => t.id !== id));
  };

  const handleViewRegistrations = () => {
    setRegistrations([
      { id: 1, name: "Ali Khan", email: "ali@example.com" },
      { id: 2, name: "Sara Ahmed", email: "sara@example.com" },
    ]);
    setShowRegistrations(true);
  };

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      price: "",
      level: "Beginner",
      prizePool: "",
    });
    setEditingTournament(null);
    setShowForm(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#0f172a] text-white">
      {/* Navigation */}
      <Navigation />
      <div className="px-6 py-16 max-w-7xl mx-auto">
        {/* Header */}
        <br /> <br />
        <div className="flex justify-between items-center mb-12">
          <br />

          <h1 className="text-4xl font-extrabold text-emerald-400 drop-shadow-lg">
            🏆 Tournament Management
          </h1>
          <button
            onClick={() => setShowForm(true)}
            className="bg-emerald-600 hover:bg-emerald-700 px-6 py-3 rounded-xl shadow-lg flex items-center gap-2 transition"
          >
            <Plus className="w-5 h-5" /> Add Tournament
          </button>
        </div>

        {/* Tournament Cards */}
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {tournaments.map((tournament, index) => (
            <motion.div
              key={tournament.id}
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-lg p-6 hover:shadow-2xl hover:scale-[1.02] transition transform"
            >
              <h3 className="text-2xl font-bold text-emerald-300 mb-2">
                {tournament.name}
              </h3>
              <p className="text-gray-300 text-sm mb-4">
                {tournament.description}
              </p>
              <div className="space-y-2 text-sm text-gray-400">
                <p className="flex items-center gap-2">
                  <DollarSign className="w-4 h-4 text-emerald-400" />
                  Entry Fee: {tournament.price}
                </p>
                <p className="flex items-center gap-2">
                  <Target className="w-4 h-4 text-blue-400" />
                  Level: {tournament.level}
                </p>
                <p className="flex items-center gap-2">
                  <Trophy className="w-4 h-4 text-yellow-400" />
                  Prize: {tournament.prizePool}
                </p>
              </div>
              <div className="flex gap-2 mt-6">
                <button
                  onClick={() => handleEdit(tournament)}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 px-3 py-2 rounded-lg flex items-center justify-center gap-1"
                >
                  <Edit className="w-4 h-4" /> Edit
                </button>
                <button
                  onClick={() => handleDelete(tournament.id)}
                  className="flex-1 bg-red-600 hover:bg-red-700 px-3 py-2 rounded-lg flex items-center justify-center gap-1"
                >
                  <Trash2 className="w-4 h-4" /> Delete
                </button>
                <button
                  onClick={() => handleViewRegistrations(tournament.id)}
                  className="flex-1 bg-purple-600 hover:bg-purple-700 px-3 py-2 rounded-lg flex items-center justify-center gap-1"
                >
                  <Users className="w-4 h-4" /> Registrations
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Add/Edit Tournament Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 px-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-gray-900 p-8 rounded-2xl shadow-xl w-full max-w-lg border border-white/10"
          >
            <h2 className="text-2xl font-semibold mb-6 text-emerald-400">
              {editingTournament ? "✏️ Edit Tournament" : "➕ Add Tournament"}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="text"
                name="name"
                placeholder="Tournament Name"
                value={formData.name}
                onChange={handleInputChange}
                className="w-full p-3 rounded-xl bg-gray-800 text-white border border-gray-700 focus:ring-2 focus:ring-emerald-500"
                required
              />
              <textarea
                name="description"
                placeholder="Description"
                value={formData.description}
                onChange={handleInputChange}
                className="w-full p-3 rounded-xl bg-gray-800 text-white border border-gray-700 focus:ring-2 focus:ring-emerald-500"
                required
              />
              <input
                type="number"
                name="price"
                placeholder="Entry Fee"
                value={formData.price}
                onChange={handleInputChange}
                className="w-full p-3 rounded-xl bg-gray-800 text-white border border-gray-700 focus:ring-2 focus:ring-emerald-500"
                required
              />
              <select
                name="level"
                value={formData.level}
                onChange={handleInputChange}
                className="w-full p-3 rounded-xl bg-gray-800 text-white border border-gray-700 focus:ring-2 focus:ring-emerald-500"
              >
                <option>Beginner</option>
                <option>Intermediate</option>
                <option>Advanced</option>
              </select>
              <input
                type="text"
                name="prizePool"
                placeholder="Prize Pool"
                value={formData.prizePool}
                onChange={handleInputChange}
                className="w-full p-3 rounded-xl bg-gray-800 text-white border border-gray-700 focus:ring-2 focus:ring-emerald-500"
              />
              <div className="flex gap-4 pt-2">
                <button
                  type="submit"
                  className="flex-1 bg-emerald-600 hover:bg-emerald-700 px-4 py-3 rounded-xl shadow-lg"
                >
                  {editingTournament ? "Update Tournament" : "Add Tournament"}
                </button>
                <button
                  type="button"
                  onClick={resetForm}
                  className="flex-1 bg-gray-600 hover:bg-gray-700 px-4 py-3 rounded-xl shadow-lg"
                >
                  Cancel
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      {/* Registrations Modal */}
      {showRegistrations && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 px-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-gray-900 p-8 rounded-2xl shadow-xl w-full max-w-lg border border-white/10"
          >
            <h2 className="text-2xl font-bold mb-6 text-purple-400">
              Tournament Registrations
            </h2>
            {registrations.length > 0 ? (
              <ul className="space-y-3">
                {registrations.map((reg) => (
                  <li
                    key={reg.id}
                    className="bg-gray-800 p-4 rounded-xl flex justify-between items-center shadow"
                  >
                    <span className="font-medium">{reg.name}</span>
                    <span className="text-gray-400 text-sm">{reg.email}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-400">No registrations yet.</p>
            )}
            <button
              onClick={() => setShowRegistrations(false)}
              className="mt-6 w-full bg-gray-600 hover:bg-gray-700 px-4 py-3 rounded-xl shadow-lg"
            >
              Close
            </button>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default TournamentManagement;
