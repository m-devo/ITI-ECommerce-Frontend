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

export interface RegisterRequest {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  status: string;
  message: string;
  token: string;
  data: {
    email: string;
  };
  role: string;
}

export interface AuthResponse {
  status: string;
  message: string;
  token?: string;
  data?: any;
}

export interface GoogleAuthResponse {
  status: string;
  message: string;
  token: string;
  data: {
    firstName: string;
    lastName: string;
    email: string;
    role: string;
    isVerified: boolean;
  };
}
