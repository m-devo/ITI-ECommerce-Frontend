import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './reset-password.component.html',
  styleUrl: './reset-password.component.css',
})
export class ResetPasswordComponent implements OnInit {
  token = '';
  password = '';
  confirmPassword = '';
  loading = false;
  errorMessage = '';
  successMessage = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit() {
    let urlToken = this.route.snapshot.paramMap.get('token');

    if (!urlToken) {
      urlToken = this.route.snapshot.queryParamMap.get('token');
    }

    if (!urlToken) {
      this.errorMessage = 'Invalid reset link';
    } else {
      this.token = urlToken;
    }
  }

  onSubmit() {
    // Clear messages
    this.errorMessage = '';
    this.successMessage = '';

    // validation
    if (!this.password || !this.confirmPassword) {
      this.errorMessage = 'Please fill in all fields';
      return;
    }

    if (this.password !== this.confirmPassword) {
      this.errorMessage = 'Passwords do not match';
      return;
    }

    if (this.password.length < 6) {
      this.errorMessage = 'Password must be at least 6 characters';
      return;
    }

    //  reset password API
    this.loading = true;
    this.authService.resetPassword(this.token, this.password).subscribe({
      next: (response) => {
        this.loading = false;
        if (response.status === 'success') {
          this.successMessage =
            'Password reset successful! Redirecting to login...';

          setTimeout(() => {
            this.router.navigate(['/auth/login']);
          }, 3000);
        }
      },
      error: (error) => {
        this.loading = false;
        this.errorMessage =
          error.error?.message ||
          'Failed to reset password. The link may be expired or invalid.';
      },
    });
  }
}
