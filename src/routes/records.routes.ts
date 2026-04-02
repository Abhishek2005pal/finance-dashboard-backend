import { Role } from '@prisma/client';
import { Router } from 'express';
import { requireAuth } from '../middlewares/authMiddleware';
import { requireRole } from '../middlewares/roleGuard';
import {
    createRecord,
    deleteRecord,
    getRecord,
    getRecords,
    updateRecord,
} from '../modules/records/records.controller';

const router = Router();

router.use(requireAuth);

router.post('/', requireRole(Role.ADMIN), createRecord);
router.get('/', requireRole(Role.ADMIN, Role.ANALYST), getRecords);
router.get('/:id', requireRole(Role.ADMIN, Role.ANALYST), getRecord);
router.patch('/:id', requireRole(Role.ADMIN), updateRecord);
router.delete('/:id', requireRole(Role.ADMIN), deleteRecord);

export default router;
