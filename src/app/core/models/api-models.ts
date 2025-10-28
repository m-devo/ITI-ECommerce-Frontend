export interface User {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  googleId: string;
  role: "user" | "admin" | "author";
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

// all models here


