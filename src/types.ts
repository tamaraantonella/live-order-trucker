export type Role = 'delivery' | 'client';

export type OrderStatus = 'pending' | 'in_progress' | 'delivered';

export interface AuthenticatedUser {
  id: number;
  email: string;
  role: Role;
}

export interface AuthenticatedRequest extends Request {
  user: AuthenticatedUser;
}
