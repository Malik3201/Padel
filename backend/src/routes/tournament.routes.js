import express from 'express';
import {
  getTournaments,
  getTournamentById,
  createTournament,
  updateTournament,
  deleteTournament,
  registerForTournament,
  getTournamentRegistrations,
  getOrganizerTournaments,
  approveTournament,
  getTournamentStats
} from '../controllers/tournamentController.js';
import { authenticate, authorize, optionalAuth } from '../middleware/auth.js';
import { uploadMultiple } from '../middleware/upload.js';

const router = express.Router();

// Public routes
router.get('/', optionalAuth, getTournaments);
router.get('/:id/registrations', getTournamentRegistrations);
router.get('/:id', getTournamentById);

// Protected routes
router.use(authenticate);

// Player routes
router.post('/:tournamentId/register', registerForTournament);

// Organizer routes
router.post('/', authorize('organizer', 'admin'), uploadMultiple('images'), createTournament);
router.get('/organizer/my-tournaments', authorize('organizer', 'admin'), getOrganizerTournaments);
router.put('/:id', authorize('organizer', 'admin'), uploadMultiple('images'), updateTournament);
router.delete('/:id', authorize('organizer', 'admin'), deleteTournament);
router.get('/:id/registrations', authorize('organizer', 'admin'), getTournamentRegistrations);

// Admin routes
router.put('/:id/approve', authorize('admin'), approveTournament);

// Statistics
router.get('/stats/overview', getTournamentStats);

export default router;