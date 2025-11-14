export interface User {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  googleId: string;
  role: 'user' | 'admin' | 'author';
  token: string;
  isVerified: boolean;
  verificationToken: string;
  verificationTokenExpires: Date;
  activeSessionToken: string | null;
  pendingDeviceToken: string | null;
  pendingDeviceTokenExpires: Date | null;
  resetPasswordToken: string | null;
  resetPasswordExpires: Date | null;
  isSubscribedToNewsService: boolean;
}

// Auth Request/Response Models
export interface RegisterRequest {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user: User;
  message: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  token?: string;
  user?: User;
}

// all models here
