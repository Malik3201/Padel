import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import path, { dirname } from "path";
import { fileURLToPath } from "url";
import connectDB from "./config/db.js";

import discountRoutes from "./routes/discount.routes.js";
import promoCodeRoutes from "./routes/promoCode.routes.js";
import notificationRoutes from "./routes/notification.routes.js";
import courtRoutes from "./routes/court.routes.js";
import tournamentRoutes from "./routes/tournament.routes.js";
import testRoutes from "./routes/test.js";
import bookingRoutes from "./routes/booking.routes.js";
import { expireBookings } from "./controllers/booking.controller.js";
import authRoutes from "./routes/auth.routes.js";
import adminRoutes from "./routes/admin.routes.js";
const PORT = process.env.PORT || 5001;

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
app.use(express.json());

app.use(
  cors({
    origin: ["http://localhost:5173", "http://localhost:5174"],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

// ✅ MongoDB connection
connectDB();

// ✅ Root endpoint
app.get("/", (req, res) => {
  res.json({
    message: "Padel Court Booking API is running!",
    status: "OK",
    endpoints: {
      courts: "/api/courts",
      tournaments: "/api/tournaments",
    },
  });
});

// ✅ Routes
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/discounts", discountRoutes);
app.use("/api/promocodes", promoCodeRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/uploads", express.static(path.resolve(__dirname, "uploads")));
app.use("/api/bookings", bookingRoutes);
app.use("/api/test", testRoutes);
app.use("/api/courts", courtRoutes);
app.use("/api/tournaments", tournamentRoutes);

// ✅ Expire bookings check every 1 min
setInterval(expireBookings, 60 * 1000);

// ✅ Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});