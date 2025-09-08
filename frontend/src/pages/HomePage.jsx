import React, { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet";
import {
  MapPin,
  Clock,
  Star,
  Users,
  Search,
  Calendar as CalendarIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import Navigation from "@/components/Navigation";

// ✅ Dummy Courts Data
const dummyCourts = [
  {
    _id: "1",
    name: "Elite Padel Arena",
    location: "Lahore",
    type: "Indoor",
    surface: "Synthetic",
    availableSlots: ["2025-09-15T18:00", "2025-09-16T20:00"],
    description: "Premium indoor padel courts with modern facilities.",
    pricePerHour: 2500,
    maxPlayers: 4,
    rating: { average: 4.8 },
    amenities: ["Lighting", "Parking", "Locker Room"],
    images: ["https://images.unsplash.com/photo-1642352684040-ac721f390031"],
  },
  {
    _id: "2",
    name: "Karachi Padel Club",
    location: "Karachi",
    type: "Outdoor",
    surface: "Clay",
    availableSlots: ["2025-09-05T20:00", "2025-09-07T19:00"],
    description: "Spacious outdoor courts with seaside breeze.",
    pricePerHour: 1800,
    maxPlayers: 4,
    rating: { average: 4.5 },
    amenities: ["Coaching", "Parking", "Refreshments"],
    images: ["https://images.unsplash.com/photo-1508609349937-5ec4ae374ebf"],
  },
  {
    _id: "3",
    name: "Islamabad Sports Complex",
    location: "Islamabad",
    type: "Outdoor",
    surface: "Concrete",
    availableSlots: ["2025-09-10T17:00", "2025-09-11T19:00"],
    description: "Government standard padel courts with synthetic surface.",
    pricePerHour: 2000,
    maxPlayers: 4,
    rating: { average: 4.7 },
    amenities: ["Lighting", "Seating", "Refreshments"],
    images: ["https://images.unsplash.com/photo-1521412644187-c49fa049e84d"],
  },
];

const HomePage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    location: "",
    type: "",
    surface: "",
    date: "",
    time: "",
  });

  const handleSearch = (e) => {
    e.preventDefault();
  };

  const handleFilterChange = (key, value) => {
    setFilters({ ...filters, [key]: value });
  };

  // ✅ Filtering Logic
  const filteredCourts = dummyCourts.filter((court) => {
    const matchSearch =
      court.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      court.location.toLowerCase().includes(searchTerm.toLowerCase());

    const matchLocation =
      !filters.location ||
      court.location.toLowerCase().includes(filters.location.toLowerCase());

    const matchType = !filters.type || court.type === filters.type;

    const matchSurface = !filters.surface || court.surface === filters.surface;

    const matchDateTime =
      !filters.date && !filters.time
        ? true
        : court.availableSlots.some((slot) => {
            const slotDate = slot.split("T")[0];
            const slotTime = slot.split("T")[1];
            const dateMatch = !filters.date || slotDate === filters.date;
            const timeMatch = !filters.time || slotTime === filters.time;
            return dateMatch && timeMatch;
          });

    return (
      matchSearch && matchLocation && matchType && matchSurface && matchDateTime
    );
  });

  return (
    <>
      <Helmet>
        <title>PadelBook Pakistan - Find & Book Premium Padel Courts</title>
      </Helmet>
      <div className="min-h-screen">
        <Navigation />

        <section className="relative pt-20 pb-16 px-4 bg-gradient-to-t from-[#09011f] to-[#021835]">
          <div className="max-w-7xl mx-auto">
            <h2 className="font-bold text-5xl text-center mb-12 text-[#33fd65]">
              PadelBook Pakistan
            </h2>

            {/* 🔍 Modern Search Bar */}
            <div className="max-w-5xl mx-auto relative mb-12 mt-12">
              <form
                onSubmit={handleSearch}
                className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-4 flex flex-wrap md:flex-nowrap items-center gap-4 shadow-lg"
              >
                {/* Location */}
                <div className="flex items-center gap-2 flex-1">
                  <MapPin className="h-5 w-5 text-emerald-400" />
                  <Input
                    type="text"
                    placeholder="Enter location..."
                    value={filters.location}
                    onChange={(e) =>
                      handleFilterChange("location", e.target.value)
                    }
                    className="bg-transparent border-none text-white placeholder-gray-400 focus:ring-0"
                  />
                </div>

                {/* Type */}
                <select
                  className="bg-white/10 text-white px-3 py-2 rounded-lg flex-1"
                  value={filters.type}
                  onChange={(e) => handleFilterChange("type", e.target.value)}
                >
                  <option value="">All Types</option>
                  <option value="Indoor">Indoor</option>
                  <option value="Outdoor">Outdoor</option>
                </select>

                {/* Surface */}
                <select
                  className="bg-white/10 text-white px-3 py-2 rounded-lg flex-1"
                  value={filters.surface}
                  onChange={(e) => handleFilterChange("surface", e.target.value)}
                >
                  <option value="">All Surfaces</option>
                  <option value="Synthetic">Synthetic</option>
                  <option value="Clay">Clay</option>
                  <option value="Grass">Grass</option>
                  <option value="Concrete">Concrete</option>
                </select>

                {/* Date */}
                <div className="flex items-center gap-2 flex-1">
                  <CalendarIcon className="h-5 w-5 text-emerald-400" />
                  <Input
                    type="date"
                    value={filters.date}
                    onChange={(e) =>
                      handleFilterChange("date", e.target.value)
                    }
                    className="bg-transparent border-none text-white placeholder-gray-400 focus:ring-0"
                  />
                </div>

                {/* Time */}
                <div className="flex items-center gap-2 flex-1">
                  <Clock className="h-5 w-5 text-emerald-400" />
                  <Input
                    type="time"
                    value={filters.time}
                    onChange={(e) =>
                      handleFilterChange("time", e.target.value)
                    }
                    className="bg-transparent border-none text-white placeholder-gray-400 focus:ring-0"
                  />
                </div>

                {/* Search Button */}
                <Button
                  type="submit"
                  className="bg-emerald-600 hover:bg-emerald-700 px-6 py-3 rounded-xl shadow-md"
                >
                  <Search className="h-5 w-5 mr-2" />
                  Search
                </Button>
              </form>
            </div>

            {/* Courts Section */}
            <h2 className="text-3xl font-bold text-center mb-12 text-white">
              Featured Padel Courts
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredCourts.map((court, index) => (
                <motion.div
                  key={court._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Card className="court-card rounded-2xl overflow-hidden">
                    <div className="relative h-48">
                      <img
                        alt={court.name}
                        className="w-full h-full object-cover"
                        src={court.images?.[0]}
                      />
                      <div className="absolute top-4 right-4 glass-effect rounded-full px-3 py-1 flex items-center gap-1">
                        <Star className="h-4 w-4 text-yellow-400 fill-current" />
                        <span className="text-white font-medium">
                          {court.rating?.average}
                        </span>
                      </div>
                    </div>
                    <div className="p-6">
                      <h3 className="text-xl font-bold text-white mb-2">
                        {court.name}
                      </h3>
                      <div className="flex items-center gap-2 text-gray-300 mb-3">
                        <MapPin className="h-4 w-4" />
                        <span className="text-sm">{court.location}</span>
                      </div>
                      <p className="text-gray-400 text-sm mb-4 line-clamp-2">
                        {court.description}
                      </p>
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
                            {court.maxPlayers} players
                          </span>
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-2 mb-4">
                        {court.amenities?.slice(0, 3).map((amenity, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-1 bg-emerald-500/20 text-emerald-300 text-xs rounded-full"
                          >
                            {amenity}
                          </span>
                        ))}
                      </div>
                      <Link to={`/court/${court._id}`}>
                        <Button className="w-full bg-[#81f564] hover:bg-[#7cfa5c] text-[#032c19]">
                          View Details & Book
                        </Button>
                      </Link>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>

            {filteredCourts.length === 0 && (
              <div className="text-center py-12 col-span-full">
                <p className="text-gray-400 text-lg">
                  No courts found matching your search or filters.
                </p>
              </div>
            )}
          </div>
        </section>
      </div>
    </>
  );
};

export default HomePage;
