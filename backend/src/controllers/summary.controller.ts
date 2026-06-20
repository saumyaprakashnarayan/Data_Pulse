import type { Response } from 'express';
import { getAnalyticsSummary } from '../services/event.service';
import { asyncHandler } from '../utils/asyncHandler';
import type { AuthenticatedRequest } from '../middleware/authMiddleware';

export const getSummary = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const user = req.user;
  const summary = await getAnalyticsSummary(
    user?.role === 'user' && user.customerId ? { customerId: user.customerId } : {},
  );
  res.json(summary);
});
