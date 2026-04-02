import { Role } from '@prisma/client';
import { Router } from 'express';
import { requireAuth } from '../middlewares/authMiddleware';
import { requireRole } from '../middlewares/roleGuard';
import { deleteUser, getUser, getUsers, updateUser } from '../modules/users/users.controller';

const router = Router();

router.use(requireAuth, requireRole(Role.ADMIN));

router.get('/', getUsers);
router.get('/:id', getUser);
router.patch('/:id', updateUser);
router.delete('/:id', deleteUser);

export default router;
