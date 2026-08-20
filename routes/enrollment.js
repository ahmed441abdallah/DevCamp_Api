import express from 'express';
import {
    getEnrollments,
    getEnrollment,
    createEnrollment,
    rejectEnrollment,
    approveEnrollment,
    getCurrentUserEnrollments
} from '../controllers/enrollment.js';

import { protect } from '../middlewares/auth.js';
import { authorize } from '../middlewares/authorize.js';

const router = express.Router({ mergeParams: true });

// GET  /api/v1/enrollments              → list all (publisher/admin)
// GET  /api/v1/bootcamps/:bootcampId/enrollments → list for a bootcamp
router.route('/')
    .get(protect, authorize('publisher', 'admin'), getEnrollments);

// GET  /api/v1/enrollments/me           → current user's enrollments
router.route('/me')
    .get(protect, getCurrentUserEnrollments);

// POST /api/v1/enrollments/:bootcampId  → enroll in a bootcamp directly
// GET  /api/v1/enrollments/:id          → get single enrollment by enrollment ID
router.route('/:id')
    .get(protect, getEnrollment)
    .post(protect, authorize('user', 'admin'), createEnrollment);

// PUT  /api/v1/enrollments/:id/approve
router.route('/:id/approve')
    .put(protect, authorize('publisher', 'admin'), approveEnrollment);

// PUT  /api/v1/enrollments/:id/reject
router.route('/:id/reject')
    .put(protect, authorize('publisher', 'admin'), rejectEnrollment);

export default router;
