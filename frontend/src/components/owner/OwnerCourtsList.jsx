import React, { useState } from "react";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card.jsx";
import { Button } from "@/components/ui/button";
import { MapPin, Clock, Star, Users, Settings } from "lucide-react";

const OwnerCourtsList = ({ courts, bookings, refreshCourts }) => {
  const [editingCourt, setEditingCourt] = useState(null);

  // DELETE court
  const handleDelete = async (id) => {
    try {
      await fetch(`http://localhost:5000/api/courts/${id}`, {
        method: "DELETE",
      });
      await refreshCourts(); // ✅ list refresh
    } catch (err) {
      console.error("❌ Delete error:", err);
    }
  };

  // UPDATE court
  const handleEdit = async () => {
    try {
      await fetch(`http://localhost:5000/api/courts/${editingCourt.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editingCourt),
      });
      setEditingCourt(null);
      await refreshCourts(); // ✅ list refresh
    } catch (err) {
      console.error("❌ Edit error:", err);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {courts.map((court, index) => (
        <motion.div
          key={court.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
        >
          <Card className="court-card rounded-2xl overflow-hidden">
            <div className="relative h-48">
              <img
                alt={`${court.name} padel court`}
                className="w-full h-full object-cover"
                src="https://images.unsplash.com/photo-1642352684040-ac721f390031"
              />
              <div className="absolute top-4 right-4 glass-effect rounded-full px-3 py-1 flex items-center gap-1">
                <Star className="h-4 w-4 text-yellow-400 fill-current" />
                <span className="text-black font-medium">{court.rating}</span>
              </div>
            </div>

            <div className="p-6">
              <h3 className="text-xl font-bold text-black mb-2">
                {court.name}
              </h3>

              <div className="flex items-center gap-2 text-gray-300 mb-3">
                <MapPin className="h-4 w-4" />
                <span className="text-sm">{court.location}</span>
              </div>

              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-emerald-400" />
                  <span className="text-emerald-400 font-medium">
                    PKR {court.pricePerHour}/hour
                  </span>
                </div>
                <div className="flex items-center gap-1 text-gray-400">
                  <Users className="h-4 w-4" />
                  <span className="text-sm">
                    {bookings.filter((b) => b.courtId === court.id).length}{" "}
                    bookings
                  </span>
                </div>
              </div>

              <div className="flex gap-2">
                {/* Edit */}
                <Button
                  className="flex-1 bg-blue-600 hover:bg-blue-700"
                  onClick={() => setEditingCourt(court)}
                >
                  Edit
                </Button>

                {/* Delete */}
                <Button
                  className="flex-1 bg-[#0fce7577] hover:bg-[#0fce75aa]"
                  onClick={() => handleDelete(court.id)}
                >
                  Delete
                </Button>
              </div>
            </div>
          </Card>
        </motion.div>
      ))}

      {/* Edit Modal */}
      {editingCourt && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-[#088f3077] rounded-lg p-6 w-96">
            <h2 className="text-lg font-bold mb-4">Edit Court</h2>

            <input
              type="text"
              value={editingCourt.name}
              onChange={(e) =>
                setEditingCourt({ ...editingCourt, name: e.target.value })
              }
              className="w-full border p-2 mb-2 text-black"
            />
            <input
              type="text"
              value={editingCourt.location}
              onChange={(e) =>
                setEditingCourt({ ...editingCourt, location: e.target.value })
              }
              className="w-full border p-2 mb-2 text-black"
            />
            <input
              type="number"
              value={editingCourt.pricePerHour}
              onChange={(e) =>
                setEditingCourt({
                  ...editingCourt,
                  pricePerHour: e.target.value,
                })
              }
              className="w-full border p-2 mb-4 text-black"
            />

            <div className="flex justify-end gap-2">
              <Button
                className="bg-gray-400 hover:bg-gray-500"
                onClick={() => setEditingCourt(null)}
              >
                Cancel
              </Button>
              <Button
                className="bg-emerald-600 hover:bg-emerald-700"
                onClick={handleEdit}
              >
                Save
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OwnerCourtsList;
