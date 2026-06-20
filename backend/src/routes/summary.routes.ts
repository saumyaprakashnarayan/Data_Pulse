import { Router } from 'express';
import { getSummary } from '../controllers/summary.controller';

export const summaryRouter = Router();

summaryRouter.get('/', getSummary);
