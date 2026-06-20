export interface AppUser {
  email: string;
  role: 'admin' | 'user';
  customerId?: string;
  customerName?: string;
}
