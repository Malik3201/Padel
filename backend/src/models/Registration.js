import mongoose from 'mongoose';

const registrationSchema = new mongoose.Schema({
  tournament: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Tournament', 
    required: [true, "Tournament is required"] 
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, "User is required"]
  },
  name: { 
    type: String, 
    required: [true, "Name is required"],
    trim: true 
  },
  email: { 
    type: String, 
    required: [true, "Email is required"],
    lowercase: true,
    trim: true 
  },
  phone: { 
    type: String, 
    required: [true, "Phone is required"],
    trim: true 
  },
  teamName: {
    type: String,
    trim: true
  },
  skillLevel: {
    type: String,
    enum: ["Beginner", "Intermediate", "Advanced"],
    required: [true, "Skill level is required"]
  },
  partnerName: {
    type: String,
    trim: true
  },
  partnerEmail: {
    type: String,
    lowercase: true,
    trim: true
  },
  partnerPhone: {
    type: String,
    trim: true
  },
  emergencyContact: {
    name: String,
    phone: String,
    relationship: String
  },
  paymentStatus: {
    type: String,
    enum: ["pending", "paid", "refunded", "failed"],
    default: "pending"
  },
  paymentMethod: {
    type: String,
    enum: ["bank_transfer", "cash", "card"],
    default: "bank_transfer"
  },
  paymentProofUrl: String,
  paymentAmount: {
    type: Number,
    required: true,
    min: 0
  },
  registrationNotes: {
    type: String,
    maxlength: 500
  },
  status: {
    type: String,
    enum: ["pending", "confirmed", "cancelled", "rejected"],
    default: "pending"
  },
  cancellationReason: String,
  refundAmount: {
    type: Number,
    default: 0
  },
  refundStatus: {
    type: String,
    enum: ["none", "pending", "processed", "failed"],
    default: "none"
  }
}, { 
  timestamps: true 
});

// Index for efficient queries
registrationSchema.index({ tournament: 1, user: 1 });
registrationSchema.index({ email: 1, tournament: 1 });
registrationSchema.index({ status: 1, createdAt: -1 });
registrationSchema.index({ paymentStatus: 1 });

// Prevent duplicate registrations
registrationSchema.index(
  { tournament: 1, email: 1 },
  { unique: true }
);

const Registration = mongoose.model('Registration', registrationSchema);
export default Registration;