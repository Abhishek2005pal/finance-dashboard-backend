import { Role } from '@prisma/client';
import { Router } from 'express';
import { requireAuth } from '../middlewares/authMiddleware';
import { requireRole } from '../middlewares/roleGuard';
import {
    getRecentActivity,
    getSummary,
    getSummaryByCategory,
    getTrends,
} from '../modules/dashboard/dashboard.controller';

const router = Router();

router.use(requireAuth, requireRole(Role.ADMIN, Role.ANALYST));

router.get('/summary', getSummary);
router.get('/by-category', getSummaryByCategory);
router.get('/trends', getTrends);
router.get('/recent', getRecentActivity);

export default router;
