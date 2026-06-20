import { Router } from 'express';
import { trackEvent } from '../controllers/events.controller';

export const eventsRouter = Router();

eventsRouter.post('/', trackEvent);
