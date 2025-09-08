import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useParams, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { MapPin, Clock, Star, Users, Calendar, ArrowLeft, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card.jsx';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog.jsx';
import { Input } from '@/components/ui/input.jsx';
import { Label } from '@/components/ui/label.jsx';
import Navigation from '@/components/Navigation';

const CourtDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // Dummy static court data
  const [court, setCourt] = useState(null);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedSlots, setSelectedSlots] = useState([]);
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [bookingForm, setBookingForm] = useState({
    customerName: '',
    email: '',
    phone: '',
    players: 2,
  });

  useEffect(() => {
    // Static dummy data (replace with API later)
    const dummyCourt = {
      id,
      name: "Padel Arena DHA",
      location: "Karachi, Pakistan",
      description: "Premium indoor padel court with seating area and refreshments.",
      pricePerHour: 2500,
      rating: 4.7,
      amenities: ["Indoor Court", "Refreshments", "Parking", "Lighting"],
      availableSlots: [
        { time: "09:00 AM", available: true },
        { time: "10:00 AM", available: false },
        { time: "11:00 AM", available: true },
        { time: "12:00 PM", available: true },
        { time: "01:00 PM", available: false },
        { time: "02:00 PM", available: true },
      ],
    };

    setCourt(dummyCourt);
    const today = new Date();
    setSelectedDate(today.toISOString().split('T')[0]);
  }, [id]);

  const handleSlotToggle = (time) => {
    setSelectedSlots(prev =>
      prev.includes(time) ? prev.filter(t => t !== time) : [...prev, time]
    );
  };

  const handleBooking = (e) => {
    e.preventDefault();
    alert(`Booking Confirmed for ${bookingForm.customerName}!\nDate: ${selectedDate}\nSlots: ${selectedSlots.join(', ')}`);
    setIsBookingOpen(false);
    setSelectedSlots([]);
  };

  const getAvailableSlots = () => {
    if (!court || !selectedDate) return [];
    return court.availableSlots || [];
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  if (!court) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-[#3CB371]">Loading...</div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>{court.name} - Book Now | PadelBook Pakistan</title>
        <meta
          name="description"
          content={`Book ${court.name} in ${court.location}. ${court.description} Starting from PKR ${court.pricePerHour}/hour.`}
        />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-t from-[#010e1f] to-[#021835]">
        <Navigation />

        <div className="pt-20 px-4 pb-8">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="mb-6"
            >
              <Button
                variant="ghost"
                onClick={() => navigate('/')}
                className="text-white hover:bg-white/10"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Courts
              </Button>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                >
                  <div className="relative h-64 md:h-96 rounded-2xl overflow-hidden mb-6">
                    <img
                      alt={`${court.name} padel court facility`}
                      className="w-full h-full object-cover"
                      src="https://images.unsplash.com/photo-1642352684040-ac721f390031"
                    />
                    <div className="absolute top-4 right-4 glass-effect rounded-full px-3 py-1 flex items-center gap-1">
                      <Star className="h-4 w-4 text-yellow-400 fill-current" />
                      <span className="text-white font-medium">{court.rating}</span>
                    </div>
                  </div>

                  <Card className="glass-effect p-6 mb-6">
                    <h1 className="text-3xl font-bold text-white mb-4">{court.name}</h1>
                    <div className="flex items-center gap-2 text-gray-300 mb-4">
                      <MapPin className="h-5 w-5" />
                      <span>{court.location}</span>
                    </div>
                    <p className="text-gray-300 mb-6">{court.description}</p>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                      <div className="flex items-center gap-2">
                        <Clock className="h-5 w-5 text-emerald-400" />
                        <div>
                          <p className="text-white font-medium">PKR {court.pricePerHour}</p>
                          <p className="text-gray-400 text-sm">per hour</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Users className="h-5 w-5 text-blue-400" />
                        <div>
                          <p className="text-white font-medium">2-4 Players</p>
                          <p className="text-gray-400 text-sm">capacity</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Star className="h-5 w-5 text-yellow-400" />
                        <div>
                          <p className="text-white font-medium">{court.rating} Rating</p>
                          <p className="text-gray-400 text-sm">from players</p>
                        </div>
                      </div>
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-white mb-3">Amenities</h3>
                      <div className="flex flex-wrap gap-2">
                        {court.amenities.map((amenity, index) => (
                          <span
                            key={index}
                            className="px-3 py-1 bg-emerald-500/20 text-emerald-300 text-sm rounded-full flex items-center gap-1"
                          >
                            <Check className="h-3 w-3" />
                            {amenity}
                          </span>
                        ))}
                      </div>
                    </div>
                  </Card>
                </motion.div>
              </div>

              <div className="lg:col-span-1">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  className="sticky top-24"
                >
                  <Card className="glass-effect p-6">
                    <h3 className="text-xl font-bold text-white mb-4">Book This Court</h3>
                    <div className="mb-4">
                      <Label htmlFor="booking-date" className="text-white mb-2 block">
                        Select Date
                      </Label>
                      <Input
                        id="booking-date"
                        type="date"
                        value={selectedDate}
                        onChange={(e) => {
                          setSelectedDate(e.target.value);
                          setSelectedSlots([]);
                        }}
                        min={new Date().toISOString().split('T')[0]}
                        className="bg-white/10 border-white/20 text-white"
                      />
                    </div>
                    {selectedDate && (
                      <div className="mb-6">
                        <Label className="text-white mb-3 block">Available Time Slots</Label>
                        <p className="text-gray-400 text-sm mb-3">{formatDate(selectedDate)}</p>
                        <div className="grid grid-cols-2 gap-2 max-h-64 overflow-y-auto">
                          {getAvailableSlots().map((slot, index) => (
                            <button
                              key={index}
                              onClick={() => slot.available && handleSlotToggle(slot.time)}
                              className={`booking-slot p-2 rounded-lg text-sm font-medium transition-all ${
                                slot.available
                                  ? selectedSlots.includes(slot.time)
                                    ? 'selected'
                                    : 'hover:bg-emerald-500/20'
                                  : 'booked opacity-50'
                              }`}
                              disabled={!slot.available}
                            >
                              {slot.time}
                              {!slot.available && (
                                <span className="block text-xs text-red-400">Booked</span>
                              )}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                    {selectedSlots.length > 0 && (
                      <div className="mb-4 p-3 bg-emerald-500/10 rounded-lg border border-emerald-500/20">
                        <p className="text-white font-medium">Booking Summary</p>
                        <p className="text-gray-300 text-sm">Date: {formatDate(selectedDate)}</p>
                        <p className="text-gray-300 text-sm">
                          Time Slots: {selectedSlots.sort().join(', ')}
                        </p>
                        <p className="text-emerald-400 font-semibold">
                          Total: PKR {court.pricePerHour * selectedSlots.length}
                        </p>
                      </div>
                    )}
                    <Dialog open={isBookingOpen} onOpenChange={setIsBookingOpen}>
                      <DialogTrigger asChild>
                        <Button
                          className="w-full bg-emerald-600 hover:bg-emerald-700 text-white"
                          disabled={selectedSlots.length === 0}
                        >
                          <Calendar className="h-4 w-4 mr-2" />
                          Book Now
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="glass-effect border-white/20">
                        <DialogHeader>
                          <DialogTitle className="text-white">Complete Your Booking</DialogTitle>
                        </DialogHeader>
                        <form onSubmit={handleBooking} className="space-y-4">
                          <div>
                            <Label htmlFor="customer-name" className="text-white">
                              Full Name *
                            </Label>
                            <Input
                              id="customer-name"
                              value={bookingForm.customerName}
                              onChange={(e) =>
                                setBookingForm({ ...bookingForm, customerName: e.target.value })
                              }
                              className="bg-white/10 border-white/20 text-white"
                              placeholder="Enter your full name"
                              required
                            />
                          </div>
                          <div>
                            <Label htmlFor="customer-email" className="text-white">
                              Email *
                            </Label>
                            <Input
                              id="customer-email"
                              type="email"
                              value={bookingForm.email}
                              onChange={(e) =>
                                setBookingForm({ ...bookingForm, email: e.target.value })
                              }
                              className="bg-white/10 border-white/20 text-white"
                              placeholder="Enter your email"
                              required
                            />
                          </div>
                          <div>
                            <Label htmlFor="customer-phone" className="text-white">
                              Phone Number *
                            </Label>
                            <Input
                              id="customer-phone"
                              type="tel"
                              value={bookingForm.phone}
                              onChange={(e) =>
                                setBookingForm({ ...bookingForm, phone: e.target.value })
                              }
                              className="bg-white/10 border-white/20 text-white"
                              placeholder="Enter your phone number"
                              required
                            />
                          </div>
                          <div>
                            <Label htmlFor="players-count" className="text-white">
                              Number of Players
                            </Label>
                            <Input
                              id="players-count"
                              type="number"
                              min="2"
                              max="4"
                              value={bookingForm.players}
                              onChange={(e) =>
                                setBookingForm({
                                  ...bookingForm,
                                  players: parseInt(e.target.value),
                                })
                              }
                              className="bg-white/10 border-white/20 text-white"
                            />
                          </div>
                          <div className="p-3 bg-emerald-500/10 rounded-lg border border-emerald-500/20">
                            <p className="text-white font-medium">Booking Details</p>
                            <p className="text-gray-300 text-sm">Court: {court.name}</p>
                            <p className="text-gray-300 text-sm">Date: {formatDate(selectedDate)}</p>
                            <p className="text-gray-300 text-sm">
                              Slots: {selectedSlots.sort().join(', ')}
                            </p>
                            <p className="text-emerald-400 font-semibold">
                              Total: PKR {court.pricePerHour * selectedSlots.length}
                            </p>
                          </div>
                          <Button
                            type="submit"
                            className="w-full bg-emerald-600 hover:bg-emerald-700"
                          >
                            Confirm Booking
                          </Button>
                        </form>
                      </DialogContent>
                    </Dialog>
                  </Card>
                </motion.div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CourtDetails;
