import { Router } from 'express';
import { getSessionDetails, listSessions } from '../controllers/sessions.controller';

export const sessionsRouter = Router();

sessionsRouter.get('/', listSessions);
sessionsRouter.get('/:sessionId', getSessionDetails);
