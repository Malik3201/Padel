import express from 'express';
import {
  getCourts,
  getFeaturedCourts,
  getCourtById,
  checkAvailability,
  createCourt,
  updateCourt,
  deleteCourt,
  getOwnerCourts,
  toggleFeatured
} from '../controllers/courtController.js';
import { authenticate, authorize, optionalAuth } from '../middleware/auth.js';
import { uploadMultiple } from '../middleware/upload.js';

const router = express.Router();

// Public routes
router.get('/', optionalAuth, getCourts);
router.get('/featured', getFeaturedCourts);
router.get('/:id', getCourtById);
router.get('/:id/availability', checkAvailability);

// Protected routes
router.use(authenticate);

// Owner routes
router.post('/', authorize('owner', 'admin'), uploadMultiple('images'), createCourt);
router.get('/owner/my-courts', authorize('owner', 'admin'), getOwnerCourts);
router.put('/:id', authorize('owner', 'admin'), uploadMultiple('images'), updateCourt);
router.delete('/:id', authorize('owner', 'admin'), deleteCourt);

// Admin routes
router.put('/:id/toggle-featured', authorize('admin'), toggleFeatured);

export default router;