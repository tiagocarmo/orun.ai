export type AuthRole = "admin" | "operator" | "viewer";

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  role: AuthRole;
  organizationId?: string;
}

export interface AuthSession {
  user: AuthUser;
  token: string;
  expiresAt: Date;
}

export interface AuthResult {
  authenticated: boolean;
  user?: AuthUser;
  error?: string;
}

export interface APIKeyConfig {
  key: string;
  userId: string;
  role: AuthRole;
  organizationId?: string;
  createdAt: Date;
  expiresAt?: Date;
}
