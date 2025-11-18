import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-verify-email',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './verify-email.component.html',
  styleUrl: './verify-email.component.css',
})
export class VerifyEmailComponent implements OnInit {
  loading = true;
  success = false;
  errorMessage = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit() {
    let token = this.route.snapshot.paramMap.get('token');

    if (!token) {
      token = this.route.snapshot.queryParamMap.get('token');
    }

    if (!token) {
      this.loading = false;
      this.errorMessage = 'Invalid verification link';
      return;
    }

    // verify API
    this.authService.verifyEmail(token).subscribe({
      next: (response) => {
        this.loading = false;
        if (response.status === 'success') {
          this.success = true;

          setTimeout(() => {
            this.router.navigate(['/auth/login']);
          }, 3000);
        }
      },
      error: (error) => {
        this.loading = false;
        this.errorMessage =
          error.error?.message ||
          'Verification failed. The link may be expired or invalid.';
      },
    });
  }
}
