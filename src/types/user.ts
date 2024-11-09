export interface User {
  id: string;
  email?: string;
  role?: string;
  verified?: boolean;
  [key: string]: unknown;
}
