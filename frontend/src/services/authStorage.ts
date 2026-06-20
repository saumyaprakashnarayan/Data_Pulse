import type { AuthUser, LoginResponse } from '../types/auth';

const tokenKey = 'data-pulse-token';
const userKey = 'data-pulse-user';
const trackerSessionKey = 'casualfunnel.sessionId';
const trackerLastActivityKey = `${trackerSessionKey}.lastActivityAt`;

const readStorage = (key: string) => {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
};

const writeStorage = (key: string, value: string) => {
  try {
    localStorage.setItem(key, value);
  } catch {
    return;
  }
};

const removeStorage = (key: string) => {
  try {
    localStorage.removeItem(key);
  } catch {
    return;
  }
};

const parseJwtPayload = (token: string) => {
  const [, payload] = token.split('.');

  if (!payload) {
    return null;
  }

  try {
    const normalized = payload.replace(/-/g, '+').replace(/_/g, '/');
    const padded = normalized.padEnd(Math.ceil(normalized.length / 4) * 4, '=');
    return JSON.parse(window.atob(padded)) as { exp?: number };
  } catch {
    return null;
  }
};

export const clearAuthSession = () => {
  removeStorage(tokenKey);
  removeStorage(userKey);
  removeStorage(trackerSessionKey);
  removeStorage(trackerLastActivityKey);
};

export const saveAuthSession = ({ token, user }: LoginResponse) => {
  writeStorage(tokenKey, token);
  writeStorage(userKey, JSON.stringify(user));
};

export const getStoredToken = () => {
  const token = readStorage(tokenKey);

  if (!token) {
    return null;
  }

  const payload = parseJwtPayload(token);
  if (!payload?.exp || payload.exp * 1000 <= Date.now()) {
    clearAuthSession();
    return null;
  }

  return token;
};

export const getStoredUser = (): AuthUser | null => {
  const rawUser = readStorage(userKey);

  if (!rawUser) {
    return null;
  }

  try {
    return JSON.parse(rawUser) as AuthUser;
  } catch {
    clearAuthSession();
    return null;
  }
};

export const isAuthenticated = () => Boolean(getStoredToken());
