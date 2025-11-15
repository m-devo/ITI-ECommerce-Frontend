import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.css',
})
export class ForgotPasswordComponent {
  email = '';
  loading = false;
  errorMessage = '';
  successMessage = '';

  constructor(private authService: AuthService) {}

  onSubmit() {
    this.errorMessage = '';
    this.successMessage = '';

    //  validation
    if (!this.email) {
      this.errorMessage = 'Please enter your email';
      return;
    }

    // forgot password API
    this.loading = true;
    this.authService.forgotPassword(this.email).subscribe({
      next: (response) => {
        this.loading = false;
        this.successMessage =
          'Password reset link has been sent to your email. Please check your inbox.';
        this.email = '';
      },
      error: (error) => {
        this.loading = false;
        this.errorMessage =
          error.error?.message ||
          'Failed to send reset link. Please try again.';
      },
    });
  }
}
