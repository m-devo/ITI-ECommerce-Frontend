import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-verify-device',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './verify-device.component.html',
  styleUrl: './verify-device.component.css',
})
export class VerifyDeviceComponent implements OnInit {
  loading = true;
  success = false;
  errorMessage = '';
  token = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private http: HttpClient
  ) {}

  ngOnInit() {
    const token = this.route.snapshot.paramMap.get('token');

    if (!token) {
      this.loading = false;
      this.errorMessage = 'Invalid verification link';
      return;
    }

    this.token = token;

    // verify device
    this.http
      .get<any>(`${environment.apiUrl}/auth/verify-device/${token}`)
      .subscribe({
        next: (response) => {
          this.loading = false;
          if (response.status === 'success') {
            this.success = true;

            // Save token and user data
            localStorage.setItem('token', response.token);
            localStorage.setItem('user', JSON.stringify(response.data));

            // Redirect to home page
            setTimeout(() => {
              this.router.navigate(['/']);
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
