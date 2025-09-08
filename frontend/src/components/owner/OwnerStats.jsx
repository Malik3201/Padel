import React from 'react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card.jsx';
import { MapPin, Calendar, Users, DollarSign } from 'lucide-react';

const OwnerStats = ({ courts, bookings }) => {
  const totalRevenue = bookings.reduce((sum, booking) => sum + booking.totalAmount, 0);
  const todayBookings = bookings.filter(booking => 
    new Date(booking.date).toDateString() === new Date().toDateString()
  ).length;

  const stats = [
    { label: 'Total Courts', value: courts.length, icon: MapPin, color: 'text-emerald-400' },
    { label: "Today's Bookings", value: todayBookings, icon: Calendar, color: 'text-blue-400' },
    { label: 'Total Bookings', value: bookings.length, icon: Users, color: 'text-purple-400' },
    { label: 'Total Revenue', value: `PKR ${totalRevenue.toLocaleString()}`, icon: DollarSign, color: 'text-green-400' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.1 }}
      className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8"
    >
      {stats.map((stat, index) => (
        <Card key={index} className="glass-effect p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">{stat.label}</p>
              <p className="text-2xl font-bold text-white">{stat.value}</p>
            </div>
            <stat.icon className={`h-8 w-8 ${stat.color}`} />
          </div>
        </Card>
      ))}
    </motion.div>
  );
};

export default OwnerStats;