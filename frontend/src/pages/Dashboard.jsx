import { useState } from "react";
import Navigation from "@/components/Navigation";
import {
  Trophy,
  Calendar,
  MapPin,
  Users,
  Plus,
  Edit,
  Trash2,
  AlertCircle,
  Bell,
  BarChart3,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card.jsx";

const PadelDashboard = () => {
  const [activeTab, setActiveTab] = useState("overview");

  // ✅ Dummy Stats
  const dashboardStats = {
    totalUsers: 120,
    totalCourts: 8,
    totalTournaments: 4,
    totalBookings: 35,
    pendingBookings: 3,
    pendingTournaments: 2,
  };

  // ✅ Dummy Data
  const courts = [
    {
      id: 1,
      name: "Arena Court 1",
      location: "Karachi",
      price: 5000,
      status: "Available",
    },
    {
      id: 2,
      name: "Arena Court 2",
      location: "Lahore",
      price: 4000,
      status: "Unavailable",
    },
  ];

  const bookings = [
    {
      id: 1,
      userName: "Ali",
      courtName: "Arena Court 1",
      date: "2025-09-15",
      time: "6:00 PM",
    },
    {
      id: 2,
      userName: "Sara",
      courtName: "Arena Court 2",
      date: "2025-09-16",
      time: "7:00 PM",
    },
  ];

  const tournaments = [
    {
      id: 1,
      name: "Padel Cup Karachi",
      description: "Beginner friendly tournament",
      pricePerTeam: 10000,
      playerLevel: "beginner",
    },
    {
      id: 2,
      name: "Lahore Padel Open",
      description: "Intermediate level",
      pricePerTeam: 15000,
      playerLevel: "intermediate",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-t from-[#010e1f] to-[#021835]">
      <Navigation />
      <br />
      <br />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header with Notification */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">
              Padel Dashboard
            </h1>
            <p className="text-slate-300 text-lg">
              Welcome back! 
            </p>
          </div>

          {/* Notification Icon */}
          <div className="relative">
            <button className="p-2 rounded-full hover:bg-slate-700 transition">
              <Bell className="h-6 w-6 text-white" />
            </button>
            {/* Badge */}
            <span className="absolute top-1 right-1 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
              3
            </span>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap gap-2 mb-8 bg-slate-800/50 p-2 rounded-xl backdrop-blur-sm">
          {[
            { id: "overview", label: "Overview", icon: BarChart3 },
            { id: "bookings", label: "Bookings", icon: Calendar },
            { id: "courts", label: "Courts", icon: MapPin },
            { id: "tournaments", label: "Tournaments", icon: Trophy },
          ].map(({ id, label, icon: Icon }) => (
            <Button
              key={id}
              variant={activeTab === id ? "default" : "ghost"}
              onClick={() => setActiveTab(id)}
              className={`flex items-center gap-2 px-6 py-3 rounded-lg transition-all duration-200 ${
                activeTab === id
                  ? "bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg"
                  : "text-slate-300 hover:text-white hover:bg-slate-700/50"
              }`}
            >
              <Icon className="h-4 w-4" />
              {label}
            </Button>
          ))}
        </div>

        {/* Overview */}
        {activeTab === "overview" && (
          <div className="space-y-8">
            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="bg-gradient-to-br from-blue-500 to-blue-600 border-0 shadow-xl">
                <div className="p-6 flex items-center justify-between">
                  <div>
                    <p className="text-blue-100 text-sm">Total Users</p>
                    <p className="text-3xl font-bold text-white">
                      {dashboardStats.totalUsers}
                    </p>
                  </div>
                  <Users className="h-8 w-8 text-blue-200" />
                </div>
              </Card>
              <Card className="bg-gradient-to-br from-emerald-500 to-emerald-600 border-0 shadow-xl">
                <div className="p-6 flex items-center justify-between">
                  <div>
                    <p className="text-emerald-100 text-sm">Total Courts</p>
                    <p className="text-3xl font-bold text-white">
                      {dashboardStats.totalCourts}
                    </p>
                  </div>
                  <MapPin className="h-8 w-8 text-emerald-200" />
                </div>
              </Card>
              <Card className="bg-gradient-to-br from-purple-500 to-purple-600 border-0 shadow-xl">
                <div className="p-6 flex items-center justify-between">
                  <div>
                    <p className="text-purple-100 text-sm">Tournaments</p>
                    <p className="text-3xl font-bold text-white">
                      {dashboardStats.totalTournaments}
                    </p>
                  </div>
                  <Trophy className="h-8 w-8 text-purple-200" />
                </div>
              </Card>
              <Card className="bg-gradient-to-br from-orange-500 to-orange-600 border-0 shadow-xl">
                <div className="p-6 flex items-center justify-between">
                  <div>
                    <p className="text-orange-100 text-sm">Bookings</p>
                    <p className="text-3xl font-bold text-white">
                      {dashboardStats.totalBookings}
                    </p>
                  </div>
                  <Calendar className="h-8 w-8 text-orange-200" />
                </div>
              </Card>
            </div>

            {/* Pending */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="bg-slate-800/50 border-slate-700">
                <div className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <AlertCircle className="h-5 w-5 text-yellow-400" />
                    <h3 className="text-lg font-semibold text-white">
                      Pending Bookings
                    </h3>
                  </div>
                  <p className="text-3xl font-bold text-yellow-400">
                    {dashboardStats.pendingBookings}
                  </p>
                </div>
              </Card>
              <Card className="bg-slate-800/50 border-slate-700">
                <div className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <Bell className="h-5 w-5 text-blue-400" />
                    <h3 className="text-lg font-semibold text-white">
                      Pending Tournaments
                    </h3>
                  </div>
                  <p className="text-3xl font-bold text-blue-400">
                    {dashboardStats.pendingTournaments}
                  </p>
                </div>
              </Card>
            </div>
          </div>
        )}

        {/* Bookings */}
        {activeTab === "bookings" && (
          <Card className="bg-slate-800/50 border-slate-700 p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-white">
                Bookings Management
              </h2>
              <Button className="bg-emerald-600 hover:bg-emerald-700">
                <Plus className="h-4 w-4 mr-2" /> New Booking
              </Button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-700">
                    <th className="text-left py-3 px-4 text-slate-300">User</th>
                    <th className="text-left py-3 px-4 text-slate-300">
                      Court
                    </th>
                    <th className="text-left py-3 px-4 text-slate-300">Date</th>
                    <th className="text-left py-3 px-4 text-slate-300">Time</th>
                    <th className="text-left py-3 px-4 text-slate-300">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {bookings.map((b) => (
                    <tr key={b.id} className="border-b border-slate-700/50">
                      <td className="py-4 px-4 text-white">{b.userName}</td>
                      <td className="py-4 px-4 text-slate-300">
                        {b.courtName}
                      </td>
                      <td className="py-4 px-4 text-slate-300">{b.date}</td>
                      <td className="py-4 px-4 text-slate-300">{b.time}</td>
                      <td className="py-4 px-4 flex gap-2">
                        <Button size="sm" variant="ghost">
                          <Edit className="h-4 w-4 text-slate-400" />
                        </Button>
                        <Button size="sm" variant="ghost">
                          <Trash2 className="h-4 w-4 text-red-400" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        )}

        {/* Courts */}
        {activeTab === "courts" && (
          <Card className="bg-slate-800/50 border-slate-700 p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-white">Courts Management</h2>
              <Button className="bg-emerald-600 hover:bg-emerald-700">
                <Plus className="h-4 w-4 mr-2" /> Add Court
              </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {courts.map((c) => (
                <Card
                  key={c.id}
                  className="bg-slate-700/50 border-slate-600 p-6"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-white">
                        {c.name}
                      </h3>
                      <p className="text-slate-400 text-sm">{c.location}</p>
                    </div>
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${
                        c.status === "Available"
                          ? "bg-emerald-500/20 text-emerald-400"
                          : "bg-red-500/20 text-red-400"
                      }`}
                    >
                      {c.status}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-2xl font-bold text-emerald-400">
                      Rs. {c.price}
                    </span>
                    <div className="flex gap-2">
                      <Button size="sm" variant="ghost">
                        <Edit className="h-4 w-4 text-slate-400" />
                      </Button>
                      <Button size="sm" variant="ghost">
                        <Trash2 className="h-4 w-4 text-red-400" />
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </Card>
        )}

        {/* Tournaments */}
        {activeTab === "tournaments" && (
          <Card className="bg-slate-800/50 border-slate-700 p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-white">
                Tournaments Management
              </h2>
              <Button className="bg-emerald-600 hover:bg-emerald-700">
                <Plus className="h-4 w-4 mr-2" /> Add Tournament
              </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {tournaments.map((t) => (
                <Card
                  key={t.id}
                  className="bg-slate-700/50 border-slate-600 p-6"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-white">
                        {t.name}
                      </h3>
                      <p className="text-slate-400 text-sm">{t.description}</p>
                    </div>
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${
                        t.playerLevel === "beginner"
                          ? "bg-green-500/20 text-green-400"
                          : t.playerLevel === "intermediate"
                          ? "bg-yellow-500/20 text-yellow-400"
                          : "bg-red-500/20 text-red-400"
                      }`}
                    >
                      {t.playerLevel}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-2xl font-bold text-emerald-400">
                      Rs. {t.pricePerTeam}
                    </span>
                    <div className="flex gap-2">
                      <Button size="sm" variant="ghost">
                        <Edit className="h-4 w-4 text-slate-400" />
                      </Button>
                      <Button size="sm" variant="ghost">
                        <Trash2 className="h-4 w-4 text-red-400" />
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </Card>
        )}
      </div>
    </div>
  );
};

export default PadelDashboard;
