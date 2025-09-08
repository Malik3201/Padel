import React from 'react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card.jsx';
import { Calendar } from 'lucide-react';

const OwnerBookingsList = ({ bookings, courts }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.3 }}
    >
      <h2 className="text-2xl font-bold text-white mb-6">Recent Bookings</h2>
      
      {bookings.length === 0 ? (
        <Card className="glass-effect p-8 text-center">
          <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-white mb-2">No Bookings Yet</h3>
          <p className="text-gray-400">
            Once customers start booking your courts, they'll appear here.
          </p>
        </Card>
      ) : (
        <Card className="glass-effect">
          <div className="p-6">
            <div className="space-y-4">
              {bookings.slice(0, 5).map((booking) => {
                const court = courts.find(c => c.id === booking.courtId);
                return (
                  <div key={booking.id} className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
                    <div>
                      <h4 className="font-semibold text-white">{court?.name || 'Unknown Court'}</h4>
                      <p className="text-gray-400 text-sm">
                        {new Date(booking.date).toLocaleDateString()} at {booking.time}
                      </p>
                      <p className="text-gray-400 text-sm">Customer: {booking.customerName}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-emerald-400">PKR {booking.totalAmount}</p>
                      <p className="text-xs text-gray-400">{booking.status}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </Card>
      )}
    </motion.div>
  );
};

export default OwnerBookingsList;