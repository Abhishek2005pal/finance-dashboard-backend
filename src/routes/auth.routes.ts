import { Router } from 'express';
import { login, register } from '../modules/auth/auth.controller';

const router = Router();

router.post('/register', register);
router.post('/login', login);

export default router;
