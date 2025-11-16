import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, catchError, finalize, Observable, of, tap,  } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})

export class AuthService {

  private http = inject(HttpClient)
  private router = inject(Router)

  private URL = "http://localhost:4000/api"

  private userSource = new BehaviorSubject<any | null>(null)

  public currentUser$ = this.userSource.asObservable()

  public isLoggedIn$ = new BehaviorSubject<boolean>(false)
  public isAdmin$ = new BehaviorSubject<boolean>(false)
  public isAuthor$ = new BehaviorSubject<boolean>(false)

  private authStatusChecked = new BehaviorSubject<boolean>(false);
  public authStatusChecked$ = this.authStatusChecked.asObservable();

login(credentials: { email: string, password: string }): Observable<any> {
    return this.http.post<any>(`${this.URL}/auth/login`, credentials).pipe(
      tap(Response => {
        if (Response && Response.token && Response.role) {

          const token = Response.token;
          const userRole = Response.role;

          const tempUser = {
            email: credentials.email,
            role: userRole
          };

          localStorage.setItem("token", token);

          this.userSource.next(tempUser);
          this.isLoggedIn$.next(true);

          if (userRole === "admin") {
            this.isAdmin$.next(true);
            this.isAuthor$.next(false);
          } else if (userRole === "author") {
            this.isAdmin$.next(false);
            this.isAuthor$.next(true);
          } else {
            this.isAdmin$.next(false);
            this.isAuthor$.next(false);
          }

          this.router.navigate(['/']);
        } else {
          this.logoutStates();
        }
      }),
      catchError(error => {
        console.error("Login failed:", error.error.message);
        this.logoutStates();
        return of(null);
      })
    );
  }

  constructor(){this.checkAuthStatus()}

  checkAuthStatus(): void {
    this.http.get<any>(`${this.URL}/auth/profile`).pipe(
      tap(Response => {

        if (Response && Response.data) {

          const user = Response.data;
          this.userSource.next(user);
          this.isLoggedIn$.next(true);

          const userRole = user.role;
          if (userRole === "admin") {
            this.isAdmin$.next(true);
            this.isAuthor$.next(false);
          } else if (userRole === "author") {
            this.isAdmin$.next(false);
            this.isAuthor$.next(true);
          } else {
            this.isAdmin$.next(false);
            this.isAuthor$.next(false);
          }
        } else {
          this.logoutStates();
        }
      }
    ),
      catchError(error => {
        this.logoutStates();
        return of(null);
      }),
      finalize(() => {
        this.authStatusChecked.next(true);
      })
    ).subscribe();
  }

  logout() {
    this.http.post(`${this.URL}/auth/logout`, {}).pipe(
      tap(()=> {
        this.logoutStates()
          this.router.navigate(['/']);
      }),
        catchError(error => {
        this.logoutStates()
        return of(null)
      })
    ).subscribe()
  }

  private logoutStates() {
    localStorage.removeItem("token");
      this.userSource.next(null)
      this.isLoggedIn$.next(false)
      this.isAdmin$.next(false)
      this.isAuthor$.next(false)
  }

  public getCurrentUserId(): string | null {
    const currentUser = this.userSource.getValue();

    return currentUser ? currentUser._id : null;
  }
}
