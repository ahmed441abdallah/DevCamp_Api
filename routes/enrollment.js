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

router.use(protect);

router.route('/')
    .get(authorize('publisher', 'admin'), getEnrollments)
    .post(authorize('user', 'admin'), createEnrollment);

router.route('/me')
    .get(getCurrentUserEnrollments);

router.route('/:id')
    .get(getEnrollment);

router.route('/:id/approve')
    .put(authorize('publisher', 'admin'), approveEnrollment);

router.route('/:id/reject')
    .put(authorize('publisher', 'admin'), rejectEnrollment);

export default router;
