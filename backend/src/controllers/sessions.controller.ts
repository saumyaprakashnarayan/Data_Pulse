import type { Response } from 'express';
import { getEventsBySessionId, getSessionSummaries } from '../services/event.service';
import { ApiError } from '../utils/ApiError';
import { asyncHandler } from '../utils/asyncHandler';
import { sessionIdParamSchema } from '../utils/validators';
import type { AuthenticatedRequest } from '../middleware/authMiddleware';

export const listSessions = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const user = req.user;
  const sessions = await getSessionSummaries(
    user?.role === 'user' && user.customerId ? { customerId: user.customerId } : {},
  );
  res.json(sessions);
});

export const getSessionDetails = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const result = sessionIdParamSchema.safeParse(req.params);

  if (!result.success) {
    throw ApiError.badRequest('Invalid session id', result.error.flatten());
  }

  const user = req.user;
  const events = await getEventsBySessionId(
    result.data.sessionId,
    user?.role === 'user' && user.customerId ? { customerId: user.customerId } : {},
  );

  if (events.length === 0) {
    throw ApiError.notFound('Session not found');
  }

  res.json(events);
});
