import type { Request, Response } from 'express';
import { createEvent } from '../services/event.service';
import { ApiError } from '../utils/ApiError';
import { asyncHandler } from '../utils/asyncHandler';
import { createEventSchema } from '../utils/validators';

export const trackEvent = asyncHandler(async (req: Request, res: Response) => {
  const result = createEventSchema.safeParse(req.body);

  if (!result.success) {
    throw ApiError.badRequest('Invalid event payload', result.error.flatten());
  }

  await createEvent(result.data);

  res.status(201).json({ success: true });
});
