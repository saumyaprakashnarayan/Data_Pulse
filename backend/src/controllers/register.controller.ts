import type { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { UserModel } from '../models/User';
import { ApiError } from '../utils/ApiError';
import { asyncHandler } from '../utils/asyncHandler';
import { z } from 'zod';

const registerSchema = z.object({
  email: z.string().trim().email(),
  password: z.string().trim().min(6),
  role: z.enum(['admin', 'user']).optional().default('user'),
  customerId: z.string().trim().min(1).max(128).optional(),
  customerName: z.string().trim().min(1).max(128).optional(),
});

export const register = asyncHandler(async (req: Request, res: Response) => {
  const result = registerSchema.safeParse(req.body);

  if (!result.success) {
    throw ApiError.badRequest('Invalid registration payload', result.error.flatten());
  }

  const { email, password, role, customerId, customerName } = result.data;

  const existing = await UserModel.findOne({ email });
  if (existing) {
    throw ApiError.badRequest('Email already registered');
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const createdUser = await UserModel.create({
    email,
    passwordHash,
    role,
    customerId,
    customerName,
  });

  res.status(201).json({
    success: true,
    user: {
      email: createdUser.email,
      role: createdUser.role,
      customerId: createdUser.customerId,
      customerName: createdUser.customerName,
    },
  });
});
