import { Router } from 'express';
import { register } from '../controllers/register.controller';

export const registerRouter = Router();

registerRouter.post('/', register);
