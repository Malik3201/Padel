import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Calendar,
  Clock,
  DollarSign,
  Image,
  Save,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card.jsx";
import { Input } from "@/components/ui/input.jsx";
import { Label } from "@/components/ui/label.jsx";
import { Textarea } from "@/components/ui/textarea";
import { Slider } from "@/components/ui/slider";
import { useToast } from "@/components/ui/use-toast";
import Navigation from "@/components/Navigation";
import axios from "axios";

const API_BASE = "http://localhost:5001/api"; // ⚡ apna backend URL lagao

const ManageCourtPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [court, setCourt] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // 🔹 Court + bookings fetch
  useEffect(() => {
    const fetchCourtAndBookings = async () => {
      try {
        const token = localStorage.getItem("token");

        // Court details
        const courtRes = await axios.get(`${API_BASE}/courts/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setCourt(courtRes.data);

        // Bookings for this court
        const bookingsRes = await axios.get(
          `${API_BASE}/bookings/court/my-bookings`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        const courtBookings = bookingsRes.data.filter(
          (b) => b.courtId === id
        );
        setBookings(courtBookings);
      } catch (err) {
        console.error(err);
        toast({
          title: "Error",
          description: "Failed to fetch court details or bookings.",
          variant: "destructive",
        });
        navigate("/owner-dashboard");
      } finally {
        setIsLoading(false);
      }
    };

    fetchCourtAndBookings();
  }, [id, navigate, toast]);

  // 🔹 Input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCourt((prev) => ({ ...prev, [name]: value }));
  };

  // 🔹 Slider change (opening/closing time)
  const handleSliderChange = ([open, close]) => {
    setCourt((prev) => ({ ...prev, openingTime: open, closingTime: close }));
  };

  // 🔹 Save court changes
  const handleSaveChanges = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");

      await axios.put(`${API_BASE}/courts/${id}`, court, {
        headers: { Authorization: `Bearer ${token}` },
      });

      toast({
        title: "Success!",
        description: "Court details have been updated.",
      });

      navigate("/owner-dashboard");
    } catch (err) {
      console.error(err);
      toast({
        title: "Update Failed",
        description: err.response?.data?.message || "Something went wrong.",
        variant: "destructive",
      });
    }
  };

  // 🔹 Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white">
        Loading...
      </div>
    );
  }

  if (!court) {
    return null;
  }

  return (
    <>
      <Helmet>
        <title>Manage {court.name} | PadelBook Pakistan</title>
        <meta
          name="description"
          content={`Manage details, bookings, and settings for ${court.name}.`}
        />
      </Helmet>
      <div className="min-h-screen bg-gradient-to-t from-[#010e1f] to-[#021835]">
        <Navigation />
        <div className="pt-20 px-4 pb-8">
          <div className="max-w-7xl mx-auto">
            {/* Back Button */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="mb-6"
            >
              <Button
                variant="ghost"
                onClick={() => navigate("/owner-dashboard")}
                className="text-white hover:bg-white/10"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Button>
            </motion.div>

            {/* Title */}
            <h1 className="text-4xl font-bold text-white mb-8">
              Manage: {court.name}
            </h1>

            {/* Main Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Left Column - Form */}
              <div className="lg:col-span-2">
                <form onSubmit={handleSaveChanges}>
                  <Card className="glass-effect p-6 space-y-6">
                    {/* Court Name */}
                    <div>
                      <Label htmlFor="name" className="text-white">
                        Court Name
                      </Label>
                      <Input
                        id="name"
                        name="name"
                        value={court.name}
                        onChange={handleInputChange}
                        className="bg-white/10 border-white/20 text-white"
                      />
                    </div>

                    {/* Description */}
                    <div>
                      <Label htmlFor="description" className="text-white">
                        Description
                      </Label>
                      <Textarea
                        id="description"
                        name="description"
                        value={court.description}
                        onChange={handleInputChange}
                        className="bg-white/10 border-white/20 text-white"
                      />
                    </div>

                    {/* Price + Image */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <Label
                          htmlFor="pricePerHour"
                          className="text-white flex items-center gap-2"
                        >
                          <DollarSign className="h-4 w-4" />
                          Price per Hour (PKR)
                        </Label>
                        <Input
                          id="pricePerHour"
                          name="pricePerHour"
                          type="number"
                          value={court.pricePerHour}
                          onChange={handleInputChange}
                          className="bg-white/10 border-white/20 text-white"
                        />
                      </div>
                      <div>
                        <Label
                          htmlFor="coverImage"
                          className="text-white flex items-center gap-2"
                        >
                          <Image className="h-4 w-4" />
                          Cover Image URL
                        </Label>
                        <Input
                          id="coverImage"
                          name="coverImage"
                          value={court.images?.[0] || ""}
                          onChange={(e) =>
                            setCourt((prev) => ({
                              ...prev,
                              images: [e.target.value],
                            }))
                          }
                          className="bg-white/10 border-white/20 text-white"
                        />
                      </div>
                    </div>

                    {/* Opening Hours */}
                    <div>
                      <Label className="text-white">Operating Hours</Label>
                      <div className="flex items-center gap-4 mt-2 p-4 bg-white/5 rounded-lg">
                        <Clock className="h-5 w-5 text-emerald-400" />
                        <div className="flex-1">
                          <div className="flex justify-between text-xs text-gray-300 mb-2">
                            <span>{`${String(
                              court.openingTime
                            ).padStart(2, "0")}:00`}</span>
                            <span>{`${String(
                              court.closingTime
                            ).padStart(2, "0")}:00`}</span>
                          </div>
                          <Slider
                            value={[court.openingTime, court.closingTime]}
                            onValueChange={handleSliderChange}
                            min={0}
                            max={23}
                            step={1}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Save Button */}
                    <div className="flex justify-end">
                      <Button
                        type="submit"
                        className="bg-emerald-600 hover:bg-emerald-700"
                      >
                        <Save className="h-4 w-4 mr-2" />
                        Save Changes
                      </Button>
                    </div>
                  </Card>
                </form>
              </div>

              {/* Right Column - Bookings */}
              <div className="lg:col-span-1">
                <Card className="glass-effect p-6">
                  <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                    <Calendar className="h-5 w-5" />
                    Today's Bookings
                  </h3>
                  <div className="space-y-3 max-h-96 overflow-y-auto">
                    {bookings.filter(
                      (b) =>
                        new Date(b.date).toDateString() ===
                        new Date().toDateString()
                    ).length > 0 ? (
                      bookings
                        .filter(
                          (b) =>
                            new Date(b.date).toDateString() ===
                            new Date().toDateString()
                        )
                        .sort((a, b) => a.time.localeCompare(b.time))
                        .map((booking) => (
                          <div
                            key={booking._id}
                            className="p-3 bg-white/5 rounded-lg"
                          >
                            <p className="font-semibold text-white">
                              {booking.time}
                            </p>
                            <p className="text-sm text-gray-300">
                              {booking.customerName}
                            </p>
                            <p className="text-xs text-gray-400 capitalize">
                              {booking.status}
                            </p>
                          </div>
                        ))
                    ) : (
                      <p className="text-gray-400 text-center py-8">
                        No bookings for today.
                      </p>
                    )}
                  </div>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ManageCourtPage;
