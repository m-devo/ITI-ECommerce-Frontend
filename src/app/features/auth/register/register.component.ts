import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css',
})
export class RegisterComponent {
  // Form data
  firstName = '';
  lastName = '';
  email = '';
  password = '';
  confirmPassword = '';

  // states
  loading = false;
  errorMessage = '';
  successMessage = '';

  constructor(private authService: AuthService, private router: Router) {}

  onSubmit() {
    this.errorMessage = '';
    this.successMessage = '';

    // validation
    if (!this.firstName || !this.lastName || !this.email || !this.password) {
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

    // register API
    this.loading = true;
    this.authService
      .register({
        firstName: this.firstName,
        lastName: this.lastName,
        email: this.email,
        password: this.password,
        role: 'user',
      })
      .subscribe({
        next: (response: any) => {
          this.loading = false;
          if (response.status === 'success') {
            this.successMessage =
              response.message ||
              'Registration successful! Please check your email to verify your account.';

            setTimeout(() => {
              this.router.navigate(['/auth/login']);
            }, 3000);
          }
        },
        error: (error: any) => {
          this.loading = false;
          this.errorMessage =
            error.error?.message || 'Registration failed. Please try again.';
        },
      });
  }
}
