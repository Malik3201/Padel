import React, { useState, useEffect } from 'react';
import { X, Calendar, Clock, User, MapPin } from 'lucide-react';

const AddBookingModal = ({ isOpen, onClose, onSubmit, editingBooking = null }) => {
  const [formData, setFormData] = useState({
    courtId: '',
    userId: '',
    date: '',
    time: ''
  });

  const [courts, setCourts] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetchingData, setFetchingData] = useState(false);

  useEffect(() => {
    if (isOpen) {
      fetchCourtsAndUsers();
      if (editingBooking) {
        setFormData({
          courtId: editingBooking.courtId || '',
          userId: editingBooking.userId || '',
          date: editingBooking.date || '',
          time: editingBooking.time || ''
        });
      } else {
        setFormData({
          courtId: '',
          userId: '',
          date: '',
          time: ''
        });
      }
    }
  }, [isOpen, editingBooking]);

  const fetchCourtsAndUsers = async () => {
    setFetchingData(true);
    try {
      // Use regular court service instead of admin endpoints
      const courtsResponse = await fetch('/api/courts?limit=100');
      const usersResponse = await fetch('/api/admin/users?limit=100');

      console.log('Courts response:', courtsResponse);
      console.log('Users response:', usersResponse);

      if (courtsResponse.ok) {
        const courtsData = await courtsResponse.json();
        console.log('Courts data:', courtsData);
        setCourts(courtsData.data || courtsData || []);
      } else {
        console.error('Courts fetch failed:', courtsResponse.status, courtsResponse.statusText);
      }

      if (usersResponse.ok) {
        const usersData = await usersResponse.json();
        console.log('Users data:', usersData);
        setUsers(usersData.data || usersData || []);
      } else {
        console.error('Users fetch failed:', usersResponse.status, usersResponse.statusText);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setFetchingData(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await onSubmit(formData);
      onClose();
      // Reset form
      setFormData({
        courtId: '',
        userId: '',
        date: '',
        time: ''
      });
    } catch (error) {
      console.error('Error creating booking:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  const timeSlots = [];
  for (let hour = 6; hour <= 22; hour++) {
    for (let minute = 0; minute < 60; minute += 30) {
      const timeString = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
      timeSlots.push(timeString);
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
      <div className="bg-slate-800 rounded-xl max-w-md w-full max-h-[80vh] overflow-y-auto border border-slate-700">
        <div className="sticky top-0 bg-slate-800 border-b border-slate-700 p-4 flex items-center justify-between rounded-t-xl">
          <h2 className="text-xl font-bold text-white">{editingBooking ? 'Edit Booking' : 'Add New Booking'}</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-700 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-white" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          {fetchingData && (
            <div className="text-center py-4">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto"></div>
              <p className="text-slate-400 mt-2 text-sm">Loading data...</p>
            </div>
          )}

          {/* Court Selection */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              <MapPin className="w-4 h-4 inline mr-1" />
              Court Name
            </label>
            <input
              type="text"
              name="courtId"
              value={formData.courtId}
              onChange={handleInputChange}
              placeholder="Enter court name"
              className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* User Selection */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              <User className="w-4 h-4 inline mr-1" />
              User Name
            </label>
            <input
              type="text"
              name="userId"
              value={formData.userId}
              onChange={handleInputChange}
              placeholder="Enter user name"
              className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Date */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              <Calendar className="w-4 h-4 inline mr-1" />
              Date
            </label>
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleInputChange}
              min={new Date().toISOString().split('T')[0]}
              className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Time */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              <Clock className="w-4 h-4 inline mr-1" />
              Time
            </label>
            <select
              name="time"
              value={formData.time}
              onChange={handleInputChange}
              className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="" className="bg-slate-700">Select time...</option>
              {timeSlots.map(time => (
                <option key={time} value={time} className="bg-slate-700">
                  {time}
                </option>
              ))}
            </select>
          </div>

          {/* Submit Buttons */}
          <div className="flex justify-end space-x-3 pt-4 border-t border-slate-700">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-slate-600 rounded-lg text-slate-300 hover:bg-slate-700 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? (editingBooking ? 'Updating...' : 'Creating...') : (editingBooking ? 'Update Booking' : 'Create Booking')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddBookingModal;
