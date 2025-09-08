import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Helmet } from "react-helmet";
import { Plus, MapPin } from "lucide-react";
import { Card } from "@/components/ui/card.jsx";
import Navigation from "@/components/Navigation";
import OwnerStats from "@/components/owner/OwnerStats";
import OwnerCourtsList from "@/components/owner/OwnerCourtsList";
import OwnerBookingsList from "@/components/owner/OwnerBookingsList";
import AddCourtDialog from "@/components/owner/AddCourtDialog";
import { Button } from "@/components/ui/button";

const CourtOwnerDashboard = () => {
  const [user, setUser] = useState(null);
  const [courts, setCourts] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [isAddCourtOpen, setIsAddCourtOpen] = useState(false);

  useEffect(() => {
    // ✅ Dummy logged-in user
    const dummyUser = {
      id: 1,
      name: "Ali Khan",
      type: "owner",
    };
    setUser(dummyUser);

    // ✅ Dummy courts
    const dummyCourts = [
      {
        id: 1,
        name: "DHA Padel Court",
        location: "Karachi",
        pricePerHour: 2500,
      },
      {
        id: 2,
        name: "Lahore Sports Arena",
        location: "Lahore",
        pricePerHour: 2000,
      },
    ];
    setCourts(dummyCourts);

    // ✅ Dummy bookings
    const dummyBookings = [
      {
        id: 1,
        courtId: 1,
        user: "Ahmed",
        date: "2025-09-10",
        time: "6:00 PM - 7:00 PM",
      },
      {
        id: 2,
        courtId: 2,
        user: "Sara",
        date: "2025-09-12",
        time: "5:00 PM - 6:30 PM",
      },
    ];
    setBookings(dummyBookings);
  }, []);

  const onCourtAdded = (newCourt) => {
    setCourts((prev) => [...prev, newCourt]);
  };

  const refreshCourts = () => {
    // ✅ Abhi backend nai, isliye kuch nahi karega
    console.log("Refreshing courts (dummy)...");
  };

  return (
    <>
      <Helmet>
        <title>Court Owner Dashboard - PadelBook Pakistan</title>
        <meta
          name="description"
          content="Manage your padel courts, view bookings, and track revenue on PadelBook Pakistan."
        />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-t from-[#010e1f] to-[#021835]">
        <Navigation />

        <div className="pt-20 px-4 pb-8">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="mb-8"
            >
              <h1 className="text-4xl font-bold text-white mb-2">
                Welcome back, {user?.name}!
              </h1>
              <p className="text-gray-400">
                Manage your courts and track your business performance
              </p>
            </motion.div>

            {/* Stats */}
            <OwnerStats courts={courts} bookings={bookings} />

            {/* Courts Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mb-8"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-white">Your Courts</h2>
                <AddCourtDialog
                  user={user}
                  onCourtAdded={onCourtAdded}
                  isOpen={isAddCourtOpen}
                  setIsOpen={setIsAddCourtOpen}
                />
              </div>

              {courts.length === 0 ? (
                <Card className="glass-effect p-8 text-center">
                  <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-white mb-2">
                    No Courts Added Yet
                  </h3>
                  <p className="text-gray-400 mb-4">
                    Start by adding your first padel court to begin accepting
                    bookings.
                  </p>
                  <Button
                    onClick={() => setIsAddCourtOpen(true)}
                    className="bg-emerald-600 hover:bg-emerald-700"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Your First Court
                  </Button>
                </Card>
              ) : (
                <OwnerCourtsList
                  courts={courts}
                  bookings={bookings}
                  refreshCourts={refreshCourts} // ✅ Dummy refresh
                />
              )}
            </motion.div>

            {/* Bookings Section */}
            <OwnerBookingsList bookings={bookings} courts={courts} />
          </div>
        </div>
      </div>
    </>
  );
};

export default CourtOwnerDashboard;
