import type { Response } from 'express';
import { getClickCoordinatesByPage } from '../services/event.service';
import { ApiError } from '../utils/ApiError';
import { asyncHandler } from '../utils/asyncHandler';
import type { AuthenticatedRequest } from '../middleware/authMiddleware';
import { heatmapQuerySchema } from '../utils/validators';

export const getHeatmap = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const result = heatmapQuerySchema.safeParse(req.query);

  if (!result.success) {
    throw ApiError.badRequest('pageUrl query parameter is required', result.error.flatten());
  }

  const user = req.user;
  const points = await getClickCoordinatesByPage(
    result.data.pageUrl,
    user?.role === 'user' && user.customerId ? { customerId: user.customerId } : {},
  );
  res.json(points);
});
