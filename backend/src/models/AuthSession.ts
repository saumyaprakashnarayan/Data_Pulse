import { Schema, model, type HydratedDocument } from 'mongoose';

export interface AuthSession {
  userEmail: string;
  tokenHash: string;
  expiresAt: Date;
  revokedAt?: Date;
  lastSeenAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

export type AuthSessionDocument = HydratedDocument<AuthSession>;

const authSessionSchema = new Schema<AuthSession>(
  {
    userEmail: { type: String, required: true, trim: true, lowercase: true, index: true },
    tokenHash: { type: String, required: true, unique: true, index: true },
    expiresAt: { type: Date, required: true, index: true },
    revokedAt: { type: Date, default: undefined, index: true },
    lastSeenAt: { type: Date, required: true, default: Date.now },
  },
  {
    collection: 'auth_sessions',
    timestamps: true,
    versionKey: false,
  },
);

authSessionSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });
authSessionSchema.index({ userEmail: 1, revokedAt: 1, expiresAt: 1 });

export const AuthSessionModel = model<AuthSession>('AuthSession', authSessionSchema);
