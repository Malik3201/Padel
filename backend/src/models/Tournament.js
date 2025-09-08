import mongoose from "mongoose";

const tournamentSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  location: {
    type: String,
    required: true,
    trim: true
  },
  startDate: {
    type: Date,
    required: true
  },
  entryFee: {
    type: Number,
    required: true,
    min: 0
  },
  skillLevel: {
    type: String,
    enum: ["Beginner", "Intermediate", "Advanced"],
    required: true
  }
});

// Index for search and filtering
tournamentSchema.index({
  title: "text",
  location: "text"
});

const Tournament = mongoose.model("Tournament", tournamentSchema);
export default Tournament;
