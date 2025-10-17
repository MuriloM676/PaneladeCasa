export type Role = 'CUSTOMER' | 'CHEF' | 'ADMIN';

export type OrderStatus = 'NEW' | 'PREPARING' | 'READY' | 'DELIVERING' | 'COMPLETED' | 'CANCELLED';

export interface JwtUserPayload {
  sub: string;
  role: Role;
}
