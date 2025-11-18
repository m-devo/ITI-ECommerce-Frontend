import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import {jwtDecode} from 'jwt-decode';

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate {

  constructor(private router: Router) {}

  canActivate(): boolean {

    const token = localStorage.getItem('token');
    if (!token) {
      this.router.navigate(['/auth/login']);
      return false;
    }

    try {
      const decoded: any = jwtDecode(token);
      if (decoded.role !== 'admin') {
        this.router.navigate(['/']);
        return false;
      }
      return true;

    } catch (error) {
      this.router.navigate(['/auth/login']);
      return false;
    }
  }
}
