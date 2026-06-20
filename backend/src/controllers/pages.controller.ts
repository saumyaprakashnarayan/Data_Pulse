import type { Response } from 'express';
import { getTrackedPages } from '../services/event.service';
import { asyncHandler } from '../utils/asyncHandler';
import type { AuthenticatedRequest } from '../middleware/authMiddleware';

export const listPages = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const user = req.user;
  const pages = await getTrackedPages(
    user?.role === 'user' && user.customerId ? { customerId: user.customerId } : {},
  );
  res.json(pages);
});
