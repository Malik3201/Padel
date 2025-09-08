import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema({
  court: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Court', 
    required: [true, "Court is required"] 
  },
  user: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: [true, "User is required"] 
  },
  date: { 
    type: String, 
    required: [true, "Date is required"] 
  }, // YYYY-MM-DD (local date)
  time: { 
    type: String, 
    required: [true, "Time is required"] 
  }, // HH:mm (24h)
  duration: {
    type: Number,
    default: 1, // hours
    min: 1,
    max: 8
  },
  players: { 
    type: Number, 
    default: 2,
    min: 1,
    max: 8
  },
  totalAmount: { 
    type: Number, 
    required: [true, "Total amount is required"],
    min: 0
  },
  status: {
    type: String,
    enum: ['hold', 'pending_verification', 'confirmed', 'expired', 'cancelled', 'completed'],
    default: 'hold'
  },
  holdExpiresAt: { 
    type: Date, 
    required: [true, "Hold expiry time is required"] 
  },
  paymentProofUrl: {
    type: String,
    default: null
  },
  paymentMethod: {
    type: String,
    enum: ['bank_transfer', 'cash', 'card'],
    default: 'bank_transfer'
  },
  bankDetails: {
    accountName: String,
    accountNumber: String,
    bankName: String,
    branchCode: String
  },
  notes: {
    type: String,
    maxlength: 500
  },
  cancellationReason: {
    type: String,
    maxlength: 200
  },
  refundAmount: {
    type: Number,
    default: 0
  },
  refundStatus: {
    type: String,
    enum: ['none', 'pending', 'processed', 'failed'],
    default: 'none'
  }
}, { 
  timestamps: true 
});

// Prevent double booking for active bookings
bookingSchema.index(
  { court: 1, date: 1, time: 1 },
  { 
    unique: true, 
    partialFilterExpression: { 
      status: { $in: ['hold', 'pending_verification', 'confirmed'] } 
    } 
  }
);

// Index for user bookings
bookingSchema.index({ user: 1, createdAt: -1 });

// Index for court bookings
bookingSchema.index({ court: 1, date: 1, status: 1 });

// Index for status filtering
bookingSchema.index({ status: 1, holdExpiresAt: 1 });

// Virtual for checking if booking is expired
bookingSchema.virtual('isExpired').get(function() {
  return this.status === 'hold' && new Date() > this.holdExpiresAt;
});

// Method to check if booking can be cancelled
bookingSchema.methods.canBeCancelled = function() {
  const now = new Date();
  const bookingDateTime = new Date(`${this.date}T${this.time}`);
  const hoursUntilBooking = (bookingDateTime - now) / (1000 * 60 * 60);
  
  return this.status === 'confirmed' && hoursUntilBooking > 2;
};

// Method to calculate refund amount
bookingSchema.methods.calculateRefund = function() {
  if (!this.canBeCancelled()) return 0;
  
  const now = new Date();
  const bookingDateTime = new Date(`${this.date}T${this.time}`);
  const hoursUntilBooking = (bookingDateTime - now) / (1000 * 60 * 60);
  
  if (hoursUntilBooking > 24) {
    return this.totalAmount; // Full refund
  } else if (hoursUntilBooking > 2) {
    return this.totalAmount * 0.5; // 50% refund
  }
  
  return 0; // No refund
};

const Booking = mongoose.model('Booking', bookingSchema);
export default Booking;