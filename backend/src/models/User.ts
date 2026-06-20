import { Schema, model, type HydratedDocument } from 'mongoose';

export type UserRole = 'admin' | 'user';

export interface User {
  email: string;
  passwordHash: string;
  role: UserRole;
  customerId?: string;
  customerName?: string;
  createdAt: Date;
  updatedAt: Date;
}

export type UserDocument = HydratedDocument<User>;

const userSchema = new Schema<User>(
  {
    email: { type: String, required: true, unique: true, trim: true, lowercase: true },
    passwordHash: { type: String, required: true, select: false },
    role: { type: String, enum: ['admin', 'user'], required: true, default: 'user' },
    customerId: { type: String, trim: true, default: undefined },
    customerName: { type: String, trim: true, default: undefined },
  },
  {
    collection: 'users',
    timestamps: true,
    versionKey: false,
  },
);

export const UserModel = model<User>('User', userSchema);
