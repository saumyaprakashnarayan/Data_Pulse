export interface AuthUser {
  email: string;
  role: 'admin' | 'user';
  customerId?: string;
  customerName?: string;
}

export interface LoginResponse {
  token: string;
  user: AuthUser;
}
