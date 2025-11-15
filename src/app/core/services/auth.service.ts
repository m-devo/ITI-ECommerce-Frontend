import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';
import {
  RegisterRequest,
  LoginRequest,
  LoginResponse,
  AuthResponse,
} from '../models/api-models';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = environment.apiUrl;

  // logged in user
  private currentUserSubject = new BehaviorSubject<any>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient, private router: Router) {
    // Load user from localStorage
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      this.currentUserSubject.next(JSON.parse(savedUser));
    }
  }

  // Register
  register(data: RegisterRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/auth/register`, data);
  }

  // Verify Email
  verifyEmail(token: string): Observable<AuthResponse> {
    return this.http.get<AuthResponse>(`${this.apiUrl}/auth/verify/${token}`);
  }

  // Login
  login(credentials: LoginRequest): Observable<LoginResponse> {
    return this.http
      .post<LoginResponse>(`${this.apiUrl}/auth/login`, credentials)
      .pipe(
        tap((response) => {
          // Save to localStorage
          if (response.token && response.status === 'success') {
            localStorage.setItem('authToken', response.token);
            const userData = {
              email: response.data.email,
              role: response.role,
            };
            localStorage.setItem('user', JSON.stringify(userData));
            this.currentUserSubject.next(userData);
          }
        })
      );
  }

  // Forgot Password
  forgotPassword(email: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/auth/forgot-password`, {
      email,
    });
  }

  // Reset Password
  resetPassword(token: string, newPassword: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(
      `${this.apiUrl}/auth/reset-password/${token}`,
      {
        password: newPassword,
      }
    );
  }

  //Login with Google
  loginWithGoogle(): void {
    window.location.href = `${this.apiUrl}/auth/google`;
  }

  handleGoogleCallback(token: string, user: any): void {
    localStorage.setItem('authToken', token);
    localStorage.setItem('user', JSON.stringify(user));
    this.currentUserSubject.next(user);
    this.router.navigate(['/dashboard']);
  }

  // Logout
  logout(): void {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    this.currentUserSubject.next(null);
    this.router.navigate(['/auth/login']);
  }

  // Check if is logged in
  isLoggedIn(): boolean {
    return !!localStorage.getItem('authToken');
  }

  // Get user
  getCurrentUser(): any {
    return this.currentUserSubject.value;
  }

  // Get token
  getToken(): string | null {
    return localStorage.getItem('authToken');
  }
}
