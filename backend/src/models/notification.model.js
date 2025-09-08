import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "User", 
    required: [true, "User ID is required"] 
  },
  type: { 
    type: String, 
    enum: ["booking", "cancellation", "payment", "tournament", "system"], 
    required: [true, "Notification type is required"] 
  },
  title: {
    type: String,
    required: [true, "Notification title is required"],
    maxlength: 100
  },
  message: { 
    type: String, 
    required: [true, "Notification message is required"],
    maxlength: 500
  },
  read: { 
    type: Boolean, 
    default: false 
  },
  priority: {
    type: String,
    enum: ["low", "medium", "high", "urgent"],
    default: "medium"
  },
  actionUrl: {
    type: String,
    default: null
  },
  metadata: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  }
}, { 
  timestamps: true 
});

// Index for efficient queries
notificationSchema.index({ userId: 1, read: 1, createdAt: -1 });
notificationSchema.index({ type: 1, createdAt: -1 });

const Notification = mongoose.model("Notification", notificationSchema);
export default Notification;
