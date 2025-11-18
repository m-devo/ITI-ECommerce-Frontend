interface BaseUser {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: "user" | "admin" | "author";
}


export interface User extends BaseUser {
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
export interface Book {
  _id: string;
  title: string;
  author: string;
  description: string;
  price: number;
  stock: number;
  bookPath?: string;
  imagePath?: string;
  uploadedAt?: Date;
  category?: string;
  isDeleted?: boolean;
  averageRating?: number;
  reviewCount?: number;
  __v?: number;
  updatedAt?: Date;
}

export interface CartItem {
  quantity: number;
  book: Book;
}

export interface Cart {
  _id: string;
  userId: string;
  items: CartItem[];
}

export interface CartUpdateRequest {
  bookId: string;
  quantity: number;
}

export interface CheckoutPreResponse {
  totalAmount: number;
  items: {
    bookId: string;
    title: string;
    author: string;
    price: number;
    quantity: number;
  }[];
}

export interface BillingData {
  phone: string;
  country: string;
  state: string;
  city: string;
}

export type PaymentMethod = 'paymob' | 'cod';

export interface CheckoutRequest {
  billingData: BillingData;
  paymentMethod: PaymentMethod;
}

export interface CheckoutResponse {
  paymentUrl: string;
  orderId: string;
}

export interface OrderItem {
  bookId: string;
  title: string;
  quantity: number;
  price: number;
  _id: string;
}

export interface Order {
  _id: string;
  user: string;
  items: OrderItem[];
  billingData: BillingData;
  paymentMethod: 'cod' | 'paymob';
  totalPrice: number;
  totalItems: number;
  status: 'pending' | 'paid' | 'completed' | 'cancelled' | 'failed';
  paymentTransactionId: string | null;
  createdAt: Date;
  updatedAt: Date;
  __v: number;
}

export interface AuthorRequest {
  _id: string;
  user: string;
  fullName: string;
  bio: string;
  idCard: string; // URL to uploaded image
  selfie: string; // URL to uploaded image
  status: 'pending' | 'approved' | 'rejected';
  createdAt: Date;
  reviewedBy?: string;
  reviewedAt?: Date;
  adminNote?: string;
}

export interface CreateAuthorRequestRequest {
  fullName: string;
  bio: string;
  idCard: File;
  selfie: File;
}

export interface UpdateAuthorRequestRequest {
  fullName?: string;
  bio?: string;
  idCard?: File;
  selfie?: File;
}

export interface ApiResponse<T = any> {
  statusCode: number;
  data?: T;
  message: string;
  success: boolean;
}

export interface ErrorResponse {
  statusCode: number;
  message: string;
  success: false;
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
    _id: string
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
