import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { MapPin, Clock, Star, Users, Search, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input.jsx';
import { Card } from '@/components/ui/card.jsx';
import Navigation from '@/components/Navigation';
import { Label } from '@/components/ui/label.jsx';
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuRadioGroup, DropdownMenuRadioItem } from '@/components/ui/dropdown-menu';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';

const HomePage = () => {
  const [courts, setCourts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({ city: 'all', sortBy: 'rating' });

  useEffect(() => {
    const storedCourts = JSON.parse(localStorage.getItem('padelCourts') || '[]');
    if (storedCourts.length === 0) {
      const demoCourts = [
        { id: '1', name: 'Elite Padel Club Karachi', location: 'DHA Phase 5, Karachi', city: 'Karachi', rating: 4.8, pricePerHour: 3000, amenities: ['Air Conditioning', 'Parking', 'Changing Rooms', 'Equipment Rental'], description: 'Premium padel courts with world-class facilities in the heart of Karachi.', ownerId: 'owner1', images: ['Modern padel court with professional lighting'], availableSlots: generateTimeSlots(6, 23) },
        { id: '2', name: 'Lahore Padel Arena', location: 'Gulberg III, Lahore', city: 'Lahore', rating: 4.6, pricePerHour: 2500, amenities: ['Parking', 'Cafeteria', 'Equipment Rental'], description: 'Modern padel facility with multiple courts and excellent service.', ownerId: 'owner2', images: ['Professional padel court in Lahore'], availableSlots: generateTimeSlots(7, 22) },
        { id: '3', name: 'Islamabad Sports Complex', location: 'F-7 Markaz, Islamabad', city: 'Islamabad', rating: 4.7, pricePerHour: 2800, amenities: ['Air Conditioning', 'Parking', 'Changing Rooms', 'Pro Shop'], description: 'State-of-the-art padel courts in the capital city.', ownerId: 'owner3', images: ['Premium padel facility in Islamabad'], availableSlots: generateTimeSlots(8, 24) }
      ];
      localStorage.setItem('padelCourts', JSON.stringify(demoCourts));
      setCourts(demoCourts);
    } else {
      setCourts(storedCourts);
    }
  }, []);

  const generateTimeSlots = (start, end) => {
    const slots = [];
    for (let hour = start; hour < end; hour++) {
      slots.push({ time: `${hour.toString().padStart(2, '0')}:00`, available: Math.random() > 0.3 });
    }
    return slots;
  };

  const cities = useMemo(() => ['all', ...new Set(courts.map(c => c.city).filter(Boolean))], [courts]);

  const filteredAndSortedCourts = useMemo(() => {
    return courts
      .filter(court =>
        (court.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
         court.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
         court.city.toLowerCase().includes(searchTerm.toLowerCase())) &&
        (filters.city === 'all' || court.city === filters.city)
      )
      .sort((a, b) => {
        switch (filters.sortBy) {
          case 'price_asc': return a.pricePerHour - b.pricePerHour;
          case 'price_desc': return b.pricePerHour - a.pricePerHour;
          case 'rating':
          default: return b.rating - a.rating;
        }
      });
  }, [courts, searchTerm, filters]);

  return (
    <>
      <Helmet>
        <title>PadelBook Pakistan - Find & Book Premium Padel Courts</title>
        <meta name="description" content="Discover and book the best padel courts across Pakistan. Premium facilities in Karachi, Lahore, Islamabad and more." />
      </Helmet>
      <div className="min-h-screen">
        <Navigation />
        <section className="relative pt-20 pb-16 px-4">
          <div className="max-w-7xl mx-auto">
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="text-center mb-12">
              <h1 className="text-5xl md:text-7xl font-bold mb-6 gradient-text">PadelBook Pakistan</h1>
              <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto">Discover and book premium padel courts across Pakistan. Connect with the best facilities and reserve your perfect playing time.</p>
              <div className="max-w-2xl mx-auto relative">
                <div className="glass-effect rounded-2xl p-2 flex items-center gap-2">
                  <Search className="h-5 w-5 text-gray-400 ml-4" />
                  <Input placeholder="Search courts by name, location, or city..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="flex-1 bg-transparent border-none text-white placeholder-gray-400 focus:ring-0" />
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button className="bg-emerald-600 hover:bg-emerald-700"><Filter className="h-4 w-4" /></Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="glass-effect border-white/20 w-64 p-4" align="end">
                      <DropdownMenuLabel className="text-white">Filter & Sort</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <div className="space-y-4">
                        <div>
                          <Label className="text-white text-sm">City</Label>
                          <Select value={filters.city} onValueChange={(value) => setFilters(f => ({...f, city: value}))}>
                            <SelectTrigger className="w-full bg-white/10 border-white/20 text-white"><SelectValue placeholder="Select City" /></SelectTrigger>
                            <SelectContent className="glass-effect border-white/20">
                              {cities.map(city => <SelectItem key={city} value={city} className="capitalize text-white">{city}</SelectItem>)}
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label className="text-white text-sm">Sort By</Label>
                          <DropdownMenuRadioGroup value={filters.sortBy} onValueChange={(value) => setFilters(f => ({...f, sortBy: value}))}>
                            <DropdownMenuRadioItem value="rating" className="text-white">Rating</DropdownMenuRadioItem>
                            <DropdownMenuRadioItem value="price_asc" className="text-white">Price: Low to High</DropdownMenuRadioItem>
                            <DropdownMenuRadioItem value="price_desc" className="text-white">Price: High to Low</DropdownMenuRadioItem>
                          </DropdownMenuRadioGroup>
                        </div>
                      </div>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </motion.div>
          </div>
        </section>
        <section className="px-4 pb-16">
          <div className="max-w-7xl mx-auto">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6, delay: 0.2 }}>
              <h2 className="text-3xl font-bold text-center mb-12 text-white">Featured Padel Courts</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredAndSortedCourts.map((court, index) => (
                  <motion.div key={court.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: index * 0.1 }}>
                    <Card className="court-card rounded-2xl overflow-hidden">
                      <div className="relative h-48">
                        <img  alt={`${court.name} padel court facility`} className="w-full h-full object-cover" src="https://images.unsplash.com/photo-1642352684040-ac721f390031" />
                        <div className="absolute top-4 right-4 glass-effect rounded-full px-3 py-1 flex items-center gap-1"><Star className="h-4 w-4 text-yellow-400 fill-current" /><span className="text-white font-medium">{court.rating}</span></div>
                      </div>
                      <div className="p-6">
                        <h3 className="text-xl font-bold text-white mb-2">{court.name}</h3>
                        <div className="flex items-center gap-2 text-gray-300 mb-3"><MapPin className="h-4 w-4" /><span className="text-sm">{court.location}</span></div>
                        <p className="text-gray-400 text-sm mb-4 line-clamp-2">{court.description}</p>
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center gap-2"><Clock className="h-4 w-4 text-emerald-400" /><span className="text-emerald-400 font-medium">PKR {court.pricePerHour}/hour</span></div>
                          <div className="flex items-center gap-1 text-gray-400"><Users className="h-4 w-4" /><span className="text-sm">2-4 players</span></div>
                        </div>
                        <div className="flex flex-wrap gap-2 mb-4">
                          {court.amenities.slice(0, 3).map((amenity, idx) => (<span key={idx} className="px-2 py-1 bg-emerald-500/20 text-emerald-300 text-xs rounded-full">{amenity}</span>))}
                          {court.amenities.length > 3 && (<span className="px-2 py-1 bg-gray-500/20 text-gray-300 text-xs rounded-full">+{court.amenities.length - 3} more</span>)}
                        </div>
                        <Link to={`/court/${court.id}`}><Button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white">View Details & Book</Button></Link>
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </div>
              {filteredAndSortedCourts.length === 0 && (<div className="text-center py-12"><p className="text-gray-400 text-lg">No courts found matching your search or filters.</p></div>)}
            </motion.div>
          </div>
        </section>
      </div>
    </>
  );
};

export default HomePage;