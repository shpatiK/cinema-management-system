import { Router } from 'express';
import { login, register, activate } from '../controllers/AuthController';
import { Request, Response } from 'express';

const router = Router();

// Properly typed route handlers
router.post('/register', register);
router.post('/login', login);
router.get('/activate', activate);

export default router;