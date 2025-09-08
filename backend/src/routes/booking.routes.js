import express from 'express';
import {
  createBooking,
  uploadPaymentProof,
  verifyBooking,
  getUserBookings,
  getCourtBookings,
  cancelBooking,
  getBookingById,
  getBookingStats
} from '../controllers/booking.controller.js';
import { authenticate, authorize } from '../middleware/auth.js';
import { uploadSingle } from '../middleware/upload.js';

const router = express.Router();

// All routes require authentication
router.use(authenticate);

// Player routes
router.post('/', createBooking);
router.put('/:bookingId/payment-proof', uploadSingle('paymentProofUrl'), uploadPaymentProof);
router.get('/my-bookings', getUserBookings);
router.get('/:bookingId', getBookingById);
router.put('/:bookingId/cancel', cancelBooking);

// Owner routes
router.get('/court/my-bookings', authorize('owner', 'admin'), getCourtBookings);

// Admin routes
router.put('/:bookingId/verify', authorize('admin'), verifyBooking);

// Statistics
router.get('/stats/overview', getBookingStats);

export default router;