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
  styles: [],
})
export class GoogleCallbackComponent implements OnInit {
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit() {
    // Get token and user from URL query params
    // Example: /auth/google/callback?token=abc123&user=...
    this.route.queryParams.subscribe((params) => {
      const token = params['token'];
      const userString = params['user'];

      if (token && userString) {
        try {
          const user = JSON.parse(decodeURIComponent(userString));
          this.authService.handleGoogleCallback(token, user);
        } catch (error) {
          console.error('Error parsing user data:', error);
          this.router.navigate(['/auth/login']);
        }
      } else {
        // If no token, redirect to login
        this.router.navigate(['/auth/login']);
      }
    });
  }
}
