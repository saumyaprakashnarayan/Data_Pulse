import type { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { env } from '../config/env';
import { getActiveAuthSessionByTokenId, touchAuthSession } from '../services/auth.service';
import { ApiError } from '../utils/ApiError';

export interface AuthenticatedRequest extends Request {
  authSessionId?: string;
  user?: {
    email: string;
    role: 'admin' | 'user';
    customerId?: string;
    customerName?: string;
  };
}

const authenticate = async (
  req: AuthenticatedRequest,
  _res: Response,
  next: NextFunction,
) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return next(ApiError.unauthorized('Missing or invalid token'));
  }

  try {
    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, env.JWT_SECRET as jwt.Secret);

    if (
      !decoded ||
      typeof decoded === 'string' ||
      typeof decoded.email !== 'string' ||
      (decoded.role !== 'admin' && decoded.role !== 'user') ||
      typeof decoded.jti !== 'string'
    ) {
      return next(ApiError.unauthorized('Invalid token'));
    }

    const authSession = await getActiveAuthSessionByTokenId(decoded.jti);
    if (!authSession || authSession.userEmail !== decoded.email) {
      return next(ApiError.unauthorized('Session expired or logged out'));
    }

    req.authSessionId = authSession._id.toString();
    req.user = {
      email: decoded.email,
      role: decoded.role,
      customerId: typeof decoded.customerId === 'string' ? decoded.customerId : undefined,
      customerName: typeof decoded.customerName === 'string' ? decoded.customerName : undefined,
    };
    await touchAuthSession(req.authSessionId);
    return next();
  } catch {
    return next(ApiError.unauthorized('Invalid token'));
  }
};

export const authMiddleware = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  void authenticate(req, res, next).catch(next);
};
