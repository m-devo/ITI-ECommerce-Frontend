import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate {
  constructor(private router: Router) {}

  canActivate(): Observable<boolean> | Promise<boolean> | boolean {

    const isAdmin = true; 
    if (!isAdmin) {
      this.router.navigate(['/']);
      return false;
    }
    return true;
  }
}
