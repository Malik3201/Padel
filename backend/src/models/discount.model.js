import mongoose from "mongoose";

const discountSchema = new mongoose.Schema({
  courtId: { type: mongoose.Schema.Types.ObjectId, ref: "Court", required: true },
  originalPrice: { type: Number, required: true },
  discountedPrice: { type: Number, required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  description: { type: String },
}, { timestamps: true });

export default mongoose.model("Discount", discountSchema);
