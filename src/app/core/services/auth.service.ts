import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(private http: HttpClient) {}

  login(credentials: { email: string; password: string }): Observable<any> {
    return this.http.post('/api/auth/login', credentials);
  }
 getToken(): string | null {
    return localStorage.getItem('token');
  }

  getUserId(): string | null {
    const token = this.getToken();
    if (!token) return null;

    try {
      const payload = JSON.parse(atob(token.split('.')[1])); 
      return payload.id || payload._id || payload.userId || null;
    } catch (e) {
      console.error('Invalid token:', e);
      return null;
    }
  }

}
