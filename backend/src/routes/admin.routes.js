import express from 'express';
import {
  getDashboardStats,
  getUsers,
  updateUserStatus,
  toggleCourtFeatured,
  approveTournament,
  verifyBooking,
  getAllCourts,
  createCourt,
  updateCourt,
  deleteCourt,
  getAllTournaments,
  createTournament,
  updateTournament,
  deleteTournament,
  getAllBookings,
  createBooking,
  updateBooking,
  deleteBooking
} from '../controllers/adminController.js';
import { authenticate, authorize } from '../middleware/auth.js';
import { uploadMultiple } from '../middleware/upload.js';

const router = express.Router();

import roleMiddleware from '../middleware/roleMiddleware.js';

// All admin routes require authentication and admin role
router.use(authenticate);
router.use(roleMiddleware(['admin'])); // Enable admin role authorization

// Dashboard
router.get('/dashboard', getDashboardStats);

// User management
router.get('/users', getUsers);
router.put('/users/:userId/status', updateUserStatus);

// Court management
router.get('/courts', getAllCourts);
router.post('/courts', uploadMultiple('images'), createCourt);
router.put('/courts/:courtId', uploadMultiple('images'), updateCourt);
router.put('/courts/:courtId/toggle-featured', toggleCourtFeatured);
router.delete('/courts/:courtId', deleteCourt);

// Tournament management
router.get('/tournaments', getAllTournaments);
router.post('/tournaments', uploadMultiple('images'), createTournament);
router.put('/tournaments/:tournamentId', uploadMultiple('images'), updateTournament);
router.put('/tournaments/:tournamentId/approve', approveTournament);
router.delete('/tournaments/:tournamentId', deleteTournament);

// Booking management
router.get('/bookings', getAllBookings);
router.post('/bookings', createBooking);
router.put('/bookings/:bookingId', updateBooking);
router.put('/bookings/:bookingId/verify', verifyBooking);
router.delete('/bookings/:bookingId', deleteBooking);

export default router;
