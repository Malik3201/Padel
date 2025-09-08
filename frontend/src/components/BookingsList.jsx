import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock, MapPin, Users, CreditCard, AlertCircle, CheckCircle, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useApi } from '@/hooks/useApi';
import { bookingService } from '@/services/bookingService';
import { useToast } from '@/components/ui/use-toast';

const BookingsList = ({ showFilters = true, onBookingSelect }) => {
  const [filters, setFilters] = useState({
    status: '',
    page: 1,
    limit: 10
  });

  const { data, loading, error, execute } = useApi(
    () => bookingService.getUserBookings(filters),
    [filters],
    false
  );

  const { toast } = useToast();

  // Load bookings when component mounts or filters change
  useEffect(() => {
    execute();
  }, [execute]);

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value,
      page: 1 // Reset to first page when filters change
    }));
  };

  const handleCancelBooking = async (bookingId, reason) => {
    try {
      await bookingService.cancelBooking(bookingId, reason);
      toast({
        title: "Booking Cancelled",
        description: "Your booking has been cancelled successfully.",
      });
      execute(); // Refresh the list
    } catch (err) {
      toast({
        title: "Error",
        description: err.message || "Failed to cancel booking.",
        variant: "destructive",
      });
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'confirmed':
        return <CheckCircle className="h-4 w-4 text-green-400" />;
      case 'pending_verification':
        return <Clock className="h-4 w-4 text-yellow-400" />;
      case 'hold':
        return <AlertCircle className="h-4 w-4 text-blue-400" />;
      case 'cancelled':
      case 'expired':
        return <XCircle className="h-4 w-4 text-red-400" />;
      default:
        return <Clock className="h-4 w-4 text-gray-400" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed':
        return 'text-green-400 bg-green-400/10';
      case 'pending_verification':
        return 'text-yellow-400 bg-yellow-400/10';
      case 'hold':
        return 'text-blue-400 bg-blue-400/10';
      case 'cancelled':
      case 'expired':
        return 'text-red-400 bg-red-400/10';
      default:
        return 'text-gray-400 bg-gray-400/10';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (timeString) => {
    return new Date(`2000-01-01T${timeString}`).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  if (loading && !data) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-400 mb-4">Error loading bookings: {error}</p>
        <Button onClick={() => execute()} variant="outline">
          Try Again
        </Button>
      </div>
    );
  }

  const bookings = data?.data || [];
  const pagination = data?.pagination;

  return (
    <div className="space-y-6">
      {/* Filters */}
      {showFilters && (
        <Card className="p-6 bg-white/5 backdrop-blur-sm border-white/10">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <Select value={filters.status} onValueChange={(value) => handleFilterChange('status', value)}>
                <SelectTrigger className="bg-white/10 border-white/20 text-white">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Bookings</SelectItem>
                  <SelectItem value="confirmed">Confirmed</SelectItem>
                  <SelectItem value="pending_verification">Pending Verification</SelectItem>
                  <SelectItem value="hold">On Hold</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                  <SelectItem value="expired">Expired</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </Card>
      )}

      {/* Bookings List */}
      {bookings.length === 0 ? (
        <Card className="p-12 text-center bg-white/5 backdrop-blur-sm border-white/10">
          <p className="text-gray-400 text-lg">No bookings found.</p>
        </Card>
      ) : (
        <div className="space-y-4">
          {bookings.map((booking) => (
            <motion.div
              key={booking.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Card 
                className="bg-white/5 backdrop-blur-sm border-white/10 hover:bg-white/10 transition-all duration-300 cursor-pointer"
                onClick={() => onBookingSelect && onBookingSelect(booking)}
              >
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-xl font-semibold text-white mb-2">
                        {booking.court?.name}
                      </h3>
                      <div className="flex items-center text-gray-300 mb-2">
                        <MapPin className="h-4 w-4 mr-2" />
                        <span className="text-sm">{booking.court?.location}</span>
                      </div>
                    </div>
                    <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(booking.status)}`}>
                      {getStatusIcon(booking.status)}
                      {booking.status.replace('_', ' ').toUpperCase()}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div className="flex items-center text-gray-300">
                      <Calendar className="h-4 w-4 mr-2" />
                      <span className="text-sm">{formatDate(booking.date)}</span>
                    </div>
                    
                    <div className="flex items-center text-gray-300">
                      <Clock className="h-4 w-4 mr-2" />
                      <span className="text-sm">
                        {formatTime(booking.time)} - {formatTime(
                          new Date(new Date(`2000-01-01T${booking.time}`).getTime() + booking.duration * 60 * 60 * 1000).toTimeString().slice(0, 5)
                        )}
                      </span>
                    </div>

                    <div className="flex items-center text-gray-300">
                      <Users className="h-4 w-4 mr-2" />
                      <span className="text-sm">{booking.players} players</span>
                    </div>
                  </div>

                  <div className="flex justify-between items-center">
                    <div className="text-2xl font-bold text-emerald-400">
                      ₨{booking.totalAmount?.toLocaleString()}
                    </div>
                    
                    <div className="flex gap-2">
                      {booking.status === 'hold' && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleCancelBooking(booking.id, 'User cancelled');
                          }}
                          className="border-red-400 text-red-400 hover:bg-red-400/10"
                        >
                          Cancel
                        </Button>
                      )}
                      
                      <Button
                        size="sm"
                        className="bg-emerald-600 hover:bg-emerald-700"
                        onClick={(e) => {
                          e.stopPropagation();
                          onBookingSelect && onBookingSelect(booking);
                        }}
                      >
                        View Details
                      </Button>
                    </div>
                  </div>

                  {booking.notes && (
                    <div className="mt-4 p-3 bg-white/5 rounded-lg">
                      <p className="text-sm text-gray-300">
                        <strong>Notes:</strong> {booking.notes}
                      </p>
                    </div>
                  )}
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {pagination && pagination.pages > 1 && (
        <div className="flex justify-center items-center space-x-2">
          <Button
            variant="outline"
            onClick={() => handleFilterChange('page', pagination.current - 1)}
            disabled={pagination.current <= 1}
            className="border-white/20 text-white hover:bg-white/10"
          >
            Previous
          </Button>
          
          <span className="text-white px-4">
            Page {pagination.current} of {pagination.pages}
          </span>
          
          <Button
            variant="outline"
            onClick={() => handleFilterChange('page', pagination.current + 1)}
            disabled={pagination.current >= pagination.pages}
            className="border-white/20 text-white hover:bg-white/10"
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
};

export default BookingsList;
