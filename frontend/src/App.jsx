import React from "react";
import { Routes, Route } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from "@/contexts/AuthContext";
import { NotificationProvider } from "@/contexts/NotificationContext";
import HomePage from "@/pages/HomePage";
import CourtOwnerDashboard from "@/pages/CourtOwnerDashboard";
import UserDashboard from "@/pages/UserDashboard";
import CourtDetails from "@/pages/CourtDetails";
import LoginPage from "@/pages/LoginPage";
import RegisterPage from "@/pages/RegisterPage";
import TournamentsPage from "@/pages/TournamentsPage";
import ManageCourtPage from "@/pages/ManageCourtPage";
import Dashboard from "@/pages/Dashboard";
import Events from "@/pages/Events";
import OwnerDashboard from "./pages/OwnerDashboard";
import OrganizerDashboard from "./pages/OrganizerDashboard";
import OwnerCourtsList from "./pages/OwnerCourtsList";

function App() {
  return (
    <AuthProvider>
      <NotificationProvider>
        <div className="min-h-screen bg-gradient-to-br from-emerald-900 via-teal-900 to-slate-900">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/owner-dashboard" element={<CourtOwnerDashboard />} />
            <Route path="/user-dashboard" element={<UserDashboard />} />
            <Route path="/court/:id" element={<CourtDetails />} />
            <Route path="/tournaments" element={<TournamentsPage />} />
            <Route path="/manage-court/:id" element={<ManageCourtPage />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/events" element={<Events />} />
            <Route path="/owner" element={<OwnerDashboard />} />
            <Route path="/organizer" element={<OrganizerDashboard />} />
            <Route path="/owner-courts" element={<OwnerCourtsList />} />
          </Routes>

          <Toaster />
        </div>
      </NotificationProvider>
    </AuthProvider>
  );
}

export default App;
