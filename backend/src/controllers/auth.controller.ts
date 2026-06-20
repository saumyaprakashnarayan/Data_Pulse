import type { Request, Response } from 'express';
import type { AuthenticatedRequest } from '../middleware/authMiddleware';
import { revokeAuthSession, signIn } from '../services/auth.service';
import { ApiError } from '../utils/ApiError';
import { asyncHandler } from '../utils/asyncHandler';
import { loginSchema } from '../utils/validators';

export const login = asyncHandler(async (req: Request, res: Response) => {
  const result = loginSchema.safeParse(req.body);

  if (!result.success) {
    throw ApiError.badRequest('Invalid credentials payload', result.error.flatten());
  }

  const { email, password } = result.data;

  try {
    const auth = await signIn(email, password);
    res.json(auth);
  } catch {
    throw ApiError.unauthorized('Invalid email or password');
  }
});

export const logout = asyncHandler(async (req: Request, res: Response) => {
  const authReq = req as AuthenticatedRequest;

  if (!authReq.authSessionId) {
    throw ApiError.unauthorized('Missing active session');
  }

  await revokeAuthSession(authReq.authSessionId);
  res.json({ success: true });
});
