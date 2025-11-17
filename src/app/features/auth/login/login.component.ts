import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  email = '';
  password = '';
  loading = false;
  errorMessage = '';

  constructor(private authService: AuthService, private router: Router) {}

  onSubmit() {
    this.errorMessage = '';

    if (!this.email || !this.password) {
      this.errorMessage = 'Please fill in all fields';
      return;
    }

    // login API
    this.loading = true;
    this.authService
      .login({ email: this.email, password: this.password })
      .subscribe({
        next: (response: any) => {
          this.loading = false;

          // pending device verification
          if (response.status === 'pending') {
            this.errorMessage = response.message;
            return;
          }

          // Redirect to home
          if (response.status === 'success') {
          this.router.navigate(['/']);
          }
        },
        error: (error: any) => {
          this.loading = false;
          this.errorMessage =
            error.error?.message ||
            'Login failed. Please check your credentials.';
        },
      });
  }

  // Google login
  loginWithGoogle() {
    this.authService.loginWithGoogle();
  }
}
