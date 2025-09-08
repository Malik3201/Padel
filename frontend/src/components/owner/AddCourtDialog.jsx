import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog.jsx';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input.jsx';
import { Label } from '@/components/ui/label.jsx';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import { Plus, Clock } from 'lucide-react';
import { Slider } from '@/components/ui/slider';

const AddCourtDialog = ({ user, onCourtAdded, isOpen, setIsOpen }) => {
  const [newCourt, setNewCourt] = useState({
    name: '',
    location: '',
    city: '',
    pricePerHour: '',
    description: '',
    amenities: '',
    coverImage: '',
    openingTime: 6,
    closingTime: 23,
  });
  const { toast } = useToast();

  const generateTimeSlots = (start, end) => {
    const slots = [];
    for (let hour = start; hour <= end; hour++) {
      slots.push({
        time: `${hour.toString().padStart(2, '0')}:00`,
        available: true
      });
    }
    return slots;
  };

  const handleAddCourt = (e) => {
    e.preventDefault();
    
    if (!newCourt.name || !newCourt.location || !newCourt.pricePerHour) {
      toast({
        title: "Error",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }

    const court = {
      id: `court_${Date.now()}`,
      ...newCourt,
      pricePerHour: parseInt(newCourt.pricePerHour),
      amenities: newCourt.amenities.split(',').map(a => a.trim()).filter(a => a),
      ownerId: user.id,
      rating: 4.5, // Default rating
      images: [newCourt.coverImage || 'Professional padel court facility'],
      availableSlots: generateTimeSlots(newCourt.openingTime, newCourt.closingTime),
      createdAt: new Date().toISOString()
    };

    const allCourts = JSON.parse(localStorage.getItem('padelCourts') || '[]');
    const updatedCourts = [...allCourts, court];
    localStorage.setItem('padelCourts', JSON.stringify(updatedCourts));
    
    onCourtAdded(court);
    setNewCourt({
      name: '',
      location: '',
      city: '',
      pricePerHour: '',
      description: '',
      amenities: '',
      coverImage: '',
      openingTime: 6,
      closingTime: 23,
    });
    setIsOpen(false);

    toast({
      title: "Court Added Successfully!",
      description: "Your new court is now available for bookings.",
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="bg-emerald-600 hover:bg-emerald-700">
          <Plus className="h-4 w-4 mr-2" />
          Add New Court
        </Button>
      </DialogTrigger>
      <DialogContent className="glass-effect border-white/20 max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-white">Add New Court</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleAddCourt} className="space-y-4">
          <div>
            <Label htmlFor="court-name" className="text-white">Court Name *</Label>
            <Input
              id="court-name"
              value={newCourt.name}
              onChange={(e) => setNewCourt({...newCourt, name: e.target.value})}
              className="bg-white/10 border-white/20 text-white"
              placeholder="e.g., Elite Padel Court 1"
              required
            />
          </div>
          
          <div>
            <Label htmlFor="court-location" className="text-white">Location *</Label>
            <Input
              id="court-location"
              value={newCourt.location}
              onChange={(e) => setNewCourt({...newCourt, location: e.target.value})}
              className="bg-white/10 border-white/20 text-white"
              placeholder="e.g., DHA Phase 5, Karachi"
              required
            />
          </div>

          <div>
            <Label htmlFor="court-city" className="text-white">City</Label>
            <Input
              id="court-city"
              value={newCourt.city}
              onChange={(e) => setNewCourt({...newCourt, city: e.target.value})}
              className="bg-white/10 border-white/20 text-white"
              placeholder="e.g., Karachi"
            />
          </div>

          <div>
            <Label htmlFor="court-price" className="text-white">Price per Hour (PKR) *</Label>
            <Input
              id="court-price"
              type="number"
              value={newCourt.pricePerHour}
              onChange={(e) => setNewCourt({...newCourt, pricePerHour: e.target.value})}
              className="bg-white/10 border-white/20 text-white"
              placeholder="e.g., 3000"
              required
            />
          </div>

          <div>
            <Label htmlFor="court-cover-image" className="text-white">Cover Image URL</Label>
            <Input
              id="court-cover-image"
              value={newCourt.coverImage}
              onChange={(e) => setNewCourt({...newCourt, coverImage: e.target.value})}
              className="bg-white/10 border-white/20 text-white"
              placeholder="https://example.com/image.jpg"
            />
          </div>

          <div>
            <Label className="text-white">Operating Hours</Label>
            <div className="flex items-center gap-4 mt-2 p-4 bg-white/5 rounded-lg">
              <Clock className="h-5 w-5 text-emerald-400" />
              <div className="flex-1">
                <div className="flex justify-between text-xs text-gray-300 mb-2">
                  <span>{`${String(newCourt.openingTime).padStart(2, '0')}:00`}</span>
                  <span>{`${String(newCourt.closingTime).padStart(2, '0')}:00`}</span>
                </div>
                <Slider
                  defaultValue={[6, 23]}
                  min={0}
                  max={23}
                  step={1}
                  onValueChange={([open, close]) => setNewCourt(prev => ({...prev, openingTime: open, closingTime: close}))}
                />
              </div>
            </div>
          </div>

          <div>
            <Label htmlFor="court-description" className="text-white">Description</Label>
            <Textarea
              id="court-description"
              value={newCourt.description}
              onChange={(e) => setNewCourt({...newCourt, description: e.target.value})}
              className="bg-white/10 border-white/20 text-white"
              placeholder="Describe your court facilities..."
            />
          </div>

          <div>
            <Label htmlFor="court-amenities" className="text-white">Amenities</Label>
            <Input
              id="court-amenities"
              value={newCourt.amenities}
              onChange={(e) => setNewCourt({...newCourt, amenities: e.target.value})}
              className="bg-white/10 border-white/20 text-white"
              placeholder="e.g., Air Conditioning, Parking, Equipment Rental"
            />
            <p className="text-xs text-gray-400 mt-1">Separate amenities with commas</p>
          </div>

          <Button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-700">
            Add Court
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddCourtDialog;