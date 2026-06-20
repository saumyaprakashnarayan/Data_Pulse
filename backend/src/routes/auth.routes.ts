import { Router } from 'express';
import { login, logout } from '../controllers/auth.controller';
import { authMiddleware } from '../middleware/authMiddleware';

export const authRouter = Router();

authRouter.post('/login', login);
authRouter.post('/logout', authMiddleware, logout);
