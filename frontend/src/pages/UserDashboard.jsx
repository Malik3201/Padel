import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Helmet } from "react-helmet";
import { Calendar, MapPin, CreditCard, History } from "lucide-react";
import Navigation from "@/components/Navigation";
import { Card } from "@/components/ui/card.jsx";
import { Button } from "@/components/ui/button";

const UserDashboard = () => {
  const [user, setUser] = useState({ name: "Ali Khan" });
  const [bookings, setBookings] = useState([]);

  // Dummy data load
  useEffect(() => {
    const dummyBookings = [
      {
        _id: "1",
        court: { name: "Padel Court A", location: "Karachi" },
        date: "2025-09-15",
        time: "18:00",
        status: "confirmed",
        totalAmount: 2000,
      },
      {
        _id: "2",
        court: { name: "Padel Court B", location: "Lahore" },
        date: "2025-09-05",
        time: "20:00",
        status: "cancelled",
        totalAmount: 1500,
      },
    ];
    setBookings(dummyBookings);
  }, []);

  // Split bookings
  const upcomingBookings = bookings.filter(
    (b) =>
      new Date(`${b.date}T${b.time}`) >= new Date() &&
      b.status === "confirmed"
  );
  const pastBookings = bookings.filter(
    (b) =>
      new Date(`${b.date}T${b.time}`) < new Date() ||
      b.status !== "confirmed"
  );

  const totalSpent = bookings
    .filter((b) => b.status === "confirmed")
    .reduce((sum, b) => sum + (b.totalAmount || 0), 0);

  const handleCancelBooking = (bookingId) => {
    setBookings((prev) =>
      prev.map((b) =>
        b._id === bookingId ? { ...b, status: "cancelled" } : b
      )
    );
  };

  return (
    <>
      <Helmet>
        <title>My Dashboard - PadelBook Pakistan</title>
      </Helmet>

      <div className="min-h-screen bg-gradient-to-t from-[#010e1f] to-[#021835]">
        <Navigation />

        <div className="pt-20 px-4 pb-8">
          <div className="max-w-7xl mx-auto">
            {/* Welcome */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="mb-10"
            >
              <h1 className="text-4xl font-bold text-white mb-2">
                Welcome back, {user?.name || "Player"}!
              </h1>
              <p className="text-gray-400">
                Manage your bookings and discover new courts to play
              </p>
            </motion.div>

            {/* Stats Row */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="flex flex-wrap gap-6 mb-12"
            >
              <Card className="glass-effect w-full sm:w-[48%] lg:w-[23%] p-6 flex items-center justify-between rounded-2xl shadow-lg">
                <div>
                  <p className="text-gray-400 text-sm">Upcoming</p>
                  <p className="text-2xl font-bold text-white">
                    {upcomingBookings.length}
                  </p>
                </div>
                <Calendar className="h-10 w-10 text-emerald-400" />
              </Card>

              <Card className="glass-effect w-full sm:w-[48%] lg:w-[23%] p-6 flex items-center justify-between rounded-2xl shadow-lg">
                <div>
                  <p className="text-gray-400 text-sm">Total Bookings</p>
                  <p className="text-2xl font-bold text-white">
                    {bookings.length}
                  </p>
                </div>
                <History className="h-10 w-10 text-blue-400" />
              </Card>

              <Card className="glass-effect w-full sm:w-[48%] lg:w-[23%] p-6 flex items-center justify-between rounded-2xl shadow-lg">
                <div>
                  <p className="text-gray-400 text-sm">Courts Played</p>
                  <p className="text-2xl font-bold text-white">
                    {new Set(bookings.map((b) => b.court?.name)).size}
                  </p>
                </div>
                <MapPin className="h-10 w-10 text-purple-400" />
              </Card>

              <Card className="glass-effect w-full sm:w-[48%] lg:w-[23%] p-6 flex items-center justify-between rounded-2xl shadow-lg">
                <div>
                  <p className="text-gray-400 text-sm">Total Spent</p>
                  <p className="text-2xl font-bold text-white">
                    PKR {totalSpent.toLocaleString()}
                  </p>
                </div>
                <CreditCard className="h-10 w-10 text-green-400" />
              </Card>
            </motion.div>

            {/* Upcoming Bookings */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-white mb-6">
                Upcoming Bookings
              </h2>
              {upcomingBookings.length > 0 ? (
                <div className="flex flex-wrap gap-6">
                  {upcomingBookings.map((b) => (
                    <Card
                      key={b._id}
                      className="glass-effect w-full md:w-[48%] lg:w-[32%] p-6 rounded-2xl shadow-md"
                    >
                      <h3 className="text-xl font-bold text-white">
                        {b.court?.name}
                      </h3>
                      <p className="text-gray-400">{b.court?.location}</p>
                      <p className="mt-2 text-sm">📅 {b.date}</p>
                      <p className="text-sm">⏰ {b.time}</p>
                      <p className="text-sm">💵 PKR {b.totalAmount}</p>
                      <Button
                        onClick={() => handleCancelBooking(b._id)}
                        className="mt-4 bg-red-600 hover:bg-red-700 w-full"
                      >
                        Cancel Booking
                      </Button>
                    </Card>
                  ))}
                </div>
              ) : (
                <p className="text-gray-400">No upcoming bookings.</p>
              )}
            </div>

            {/* Past Bookings */}
            <div>
              <h2 className="text-2xl font-bold text-white mb-6">
                Past Bookings
              </h2>
              {pastBookings.length > 0 ? (
                <div className="flex flex-wrap gap-6">
                  {pastBookings.map((b) => (
                    <Card
                      key={b._id}
                      className="glass-effect w-full md:w-[48%] lg:w-[32%] p-6 rounded-2xl shadow-md"
                    >
                      <h3 className="text-xl font-bold text-white">
                        {b.court?.name}
                      </h3>
                      <p className="text-gray-400">{b.court?.location}</p>
                      <p className="mt-2 text-sm">📅 {b.date}</p>
                      <p className="text-sm">⏰ {b.time}</p>
                      <p className="text-sm">💵 PKR {b.totalAmount}</p>
                      <p className="text-sm text-yellow-400">
                        Status: {b.status}
                      </p>
                    </Card>
                  ))}
                </div>
              ) : (
                <p className="text-gray-400">No past bookings.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default UserDashboard;
