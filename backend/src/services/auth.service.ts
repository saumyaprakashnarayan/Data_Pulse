import crypto from 'node:crypto';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { AuthSessionModel } from '../models/AuthSession';
import { UserModel } from '../models/User';
import { env } from '../config/env';

export interface AuthPayload {
  email: string;
  role: 'admin' | 'user';
  customerId?: string;
  customerName?: string;
}

const defaultUsers = [
  {
    email: 'admin@example.com',
    password: 'admin1234',
    role: 'admin' as const,
  },
  {
    email: 'user@example.com',
    password: 'user1234',
    role: 'user' as const,
  },
];

// export const seedDefaultUsers = async () => {
//   if (env.NODE_ENV === 'production') {
//     return;
//   }

  for (const user of defaultUsers) {
    const exists = await UserModel.exists({ email: user.email });
    if (exists) {
      continue;
    }

    const passwordHash = await bcrypt.hash(user.password, 10);
    await UserModel.create({
      email: user.email,
      passwordHash,
      role: user.role,
    });
  }
};

export const hashTokenId = (tokenId: string) =>
  crypto.createHash('sha256').update(tokenId).digest('hex');

const getTokenExpiresAt = (token: string) => {
  const decoded = jwt.decode(token);

  if (!decoded || typeof decoded === 'string' || typeof decoded.exp !== 'number') {
    throw new Error('Unable to read token expiration');
  }

  return new Date(decoded.exp * 1000);
};

export const signIn = async (email: string, password: string) => {
  const user = await UserModel.findOne({ email: email.toLowerCase().trim() }).select(
    '+passwordHash',
  );

  if (!user) {
    throw new Error('Invalid credentials');
  }

  const isValidPassword = await bcrypt.compare(password, user.passwordHash);
  if (!isValidPassword) {
    throw new Error('Invalid credentials');
  }

  const tokenId = crypto.randomUUID();
  const authPayload = {
    email: user.email,
    role: user.role,
    customerId: user.customerId,
    customerName: user.customerName,
  } satisfies AuthPayload;
  const token = jwt.sign(
    authPayload,
    env.JWT_SECRET as jwt.Secret,
    {
      expiresIn: env.JWT_EXPIRES_IN as jwt.SignOptions['expiresIn'],
      jwtid: tokenId,
    },
  );
  const expiresAt = getTokenExpiresAt(token);

  await AuthSessionModel.create({
    userEmail: user.email,
    tokenHash: hashTokenId(tokenId),
    expiresAt,
    lastSeenAt: new Date(),
  });

  return {
    token,
    user: {
      email: user.email,
      role: user.role,
      customerId: user.customerId,
      customerName: user.customerName,
    },
  };
};

export const getActiveAuthSessionByTokenId = async (tokenId: string) =>
  AuthSessionModel.findOne({
    tokenHash: hashTokenId(tokenId),
    revokedAt: { $exists: false },
    expiresAt: { $gt: new Date() },
  })
    .select({ _id: 1, userEmail: 1 })
    .lean();

export const touchAuthSession = async (authSessionId: string) => {
  await AuthSessionModel.updateOne({ _id: authSessionId }, { $set: { lastSeenAt: new Date() } });
};

export const revokeAuthSession = async (authSessionId: string) => {
  await AuthSessionModel.updateOne(
    {
      _id: authSessionId,
      revokedAt: { $exists: false },
    },
    {
      $set: { revokedAt: new Date() },
    },
  );
};
