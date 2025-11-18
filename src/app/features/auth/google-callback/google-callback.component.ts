import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-google-callback',
  standalone: true,
  imports: [],
  template: `
    <div class="min-h-screen flex items-center justify-center bg-gray-100">
      <div class="text-center">
        <div
          class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"
        ></div>
        <p class="text-gray-600 mt-4">Completing Google login...</p>
      </div>
    </div>
  `,
})
export class GoogleCallbackComponent implements OnInit {
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.route.queryParams.subscribe((params) => {
      const token = params['token'];

      if (token) {
        // user object from query params
        const user = {
          firstName: params['firstName'],
          lastName: params['lastName'],
          email: params['email'],
          role: params['role'] || 'user',
          isVerified: params['isVerified'] !== 'false',
        };

        // Save to localStorage
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));

        // Redirect to dashboard
        this.router.navigate(['/dashboard']);
      } else {
        // Handle error when no token
        this.router.navigate(['/auth/login'], {
          queryParams: { error: 'Google authentication failed' },
        });
      }
    });
  }
}
