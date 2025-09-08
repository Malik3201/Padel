import mongoose from "mongoose";

const courtSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: [true, "Court name is required"],
    trim: true 
  },
  location: { 
    type: String, 
    required: [true, "Location is required"],
    trim: true 
  },
  address: {
    street: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    zipCode: { type: String, required: true },
    country: { type: String, default: "Pakistan" }
  },
  coordinates: {
    latitude: { type: Number },
    longitude: { type: Number }
  },
  pricePerHour: { 
    type: Number, 
    required: [true, "Price per hour is required"],
    min: 0
  },
  status: { 
    type: String, 
    enum: ["Available", "Disabled", "Maintenance"], 
    default: "Available" 
  },
  type: {
    type: String,
    enum: ["Indoor", "Outdoor"],
    required: true
  },
  surface: {
    type: String,
    enum: ["Synthetic", "Clay", "Grass", "Concrete"],
    required: true
  },
  images: { 
    type: [String], 
    default: [] 
  },
  owner: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "User", 
    required: true 
  },
  isFeatured: { 
    type: Boolean, 
    default: false 
  },
  amenities: [{
    name: String,
    available: { type: Boolean, default: true }
  }],
  operatingHours: {
    monday: { open: String, close: String, closed: { type: Boolean, default: false } },
    tuesday: { open: String, close: String, closed: { type: Boolean, default: false } },
    wednesday: { open: String, close: String, closed: { type: Boolean, default: false } },
    thursday: { open: String, close: String, closed: { type: Boolean, default: false } },
    friday: { open: String, close: String, closed: { type: Boolean, default: false } },
    saturday: { open: String, close: String, closed: { type: Boolean, default: false } },
    sunday: { open: String, close: String, closed: { type: Boolean, default: false } }
  },
  description: {
    type: String,
    maxlength: 500
  },
  rules: [String],
  maxPlayers: {
    type: Number,
    default: 4
  },
  rating: {
    average: { type: Number, default: 0, min: 0, max: 5 },
    count: { type: Number, default: 0 }
  }
}, { 
  timestamps: true 
});

// Index for search functionality
courtSchema.index({ 
  name: "text", 
  location: "text", 
  "address.city": "text" 
});

// Index for filtering
courtSchema.index({ 
  status: 1, 
  type: 1, 
  surface: 1, 
  pricePerHour: 1,
  isFeatured: 1 
});

const Court = mongoose.model("Court", courtSchema);
export default Court;
