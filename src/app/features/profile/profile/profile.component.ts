import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatChipsModule } from '@angular/material/chips';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UsersService } from '../../../core/services/users.service';
import { User, AuthorRequest } from '../../../core/models/api-models';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule,
    MatDividerModule,
    MatChipsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule
  ],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent implements OnInit {
  user: User | null = null;
  isLoading = true;
  error: string | null = null;

  // Author request
  latestAuthorRequest: AuthorRequest | null = null;
  showAuthorRequestForm = false;
  editMode = false;
  authorRequestForm: FormGroup;
  idCardFile: File | null = null;
  selfieFile: File | null = null;
  idCardPreview: string | null = null;
  selfiePreview: string | null = null;
  isSubmitting = false;

  constructor(
    private usersService: UsersService,
    private fb: FormBuilder
  ) {
    this.authorRequestForm = this.fb.group({
      fullName: ['', [Validators.required, Validators.minLength(2)]],
      bio: ['', [Validators.required, Validators.minLength(50), Validators.maxLength(500)]]
    });
  }

  ngOnInit(): void {
    this.loadUserProfile();
    this.loadLatestAuthorRequest();
  }

  loadUserProfile(): void {
    this.usersService.getUserProfile().subscribe({
      next: (response) => {
        if (response.success && response.data) {
          this.user = response.data;
        } else {
          this.error = response.message || 'Failed to load profile';
        }
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading profile:', error);
        this.error = 'Failed to load profile data';
        this.isLoading = false;
      }
    });
  }

  getRoleDisplay(): string {
    return this.user?.role || '';
  }

  isEmailVerified(): boolean {
    return this.user?.isVerified || false;
  }

  isSubscribed(): boolean {
    return this.user?.isSubscribedToNewsService || false;
  }

  loadLatestAuthorRequest(): void {
    this.usersService.getLatestAuthorRequest().subscribe({
      next: (response) => {
        if (response.success && response.data) {
          this.latestAuthorRequest = response.data;
        } else {
          this.latestAuthorRequest = null;
        }
      },
      error: (error) => {
        console.error('Error loading author request:', error);
        this.latestAuthorRequest = null;
      }
    });
  }

  getRequestStatusClass(status: string): string {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'approved': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  }

  getRequestStatusText(status: string): string {
    switch (status) {
      case 'pending': return 'Pending Review';
      case 'approved': return 'Approved';
      case 'rejected': return 'Rejected';
      default: return 'Unknown';
    }
  }

  openAuthorRequestModal(): void {
    console.log('Opening author request modal');
    this.showAuthorRequestForm = true;
    this.editMode = false;
  }

  closeAuthorRequestForm(): void {
    this.showAuthorRequestForm = false;
    this.editMode = false;
    this.authorRequestForm.reset();
    this.idCardFile = null;
    this.selfieFile = null;
    this.idCardPreview = null;
    this.selfiePreview = null;
  }

  onIdCardSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.idCardFile = file;
      const reader = new FileReader();
      reader.onload = (e) => {
        this.idCardPreview = e.target?.result as string;
      };
      reader.readAsDataURL(file);
    }
  }

  onSelfieSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.selfieFile = file;
      const reader = new FileReader();
      reader.onload = (e) => {
        this.selfiePreview = e.target?.result as string;
      };
      reader.readAsDataURL(file);
    }
  }

  editRequest(request: AuthorRequest): void {
    this.editMode = true;
    this.latestAuthorRequest = request;
    this.authorRequestForm.patchValue({
      fullName: request.fullName,
      bio: request.bio
    });
    this.showAuthorRequestForm = true;
  }

  submitAuthorRequest(): void {
    if (this.authorRequestForm.invalid || !this.idCardFile || !this.selfieFile) {
      return;
    }

    this.isSubmitting = true;
    const formData = new FormData();
    formData.append('fullName', this.authorRequestForm.value.fullName);
    formData.append('bio', this.authorRequestForm.value.bio);
    formData.append('idCard', this.idCardFile);
    formData.append('selfie', this.selfieFile);

    const requestObservable = this.editMode && this.latestAuthorRequest
      ? this.usersService.updateAuthorRequest(this.latestAuthorRequest._id, formData)
      : this.usersService.createAuthorRequest(formData);

    requestObservable.subscribe({
      next: (response) => {
        if (response.success) {
          this.closeAuthorRequestForm();
          this.loadLatestAuthorRequest();
        }
        this.isSubmitting = false;
      },
      error: (error) => {
        console.error('Error submitting author request:', error);
        this.isSubmitting = false;
      }
    });
  }

  toggleNewsletterSubscription(): void {
    if (this.isSubscribed()) {
      this.unsubscribeFromNewsletter();
    } else {
      this.subscribeToNewsletter();
    }
  }

  subscribeToNewsletter(): void {
    if (!this.user?.email) return;

    this.usersService.subscribeToNewsletter(this.user.email).subscribe({
      next: (response: any) => {
        if (response.success) {
          this.user!.isSubscribedToNewsService = true;
        }
      },
      error: (error: any) => {
        console.error('Error subscribing to newsletter:', error);
      }
    });
  }

  unsubscribeFromNewsletter(): void {
    this.usersService.unsubscribeFromNewsletter().subscribe({
      next: (response: any) => {
        if (response.success) {
          this.user!.isSubscribedToNewsService = false;
        }
      },
      error: (error: any) => {
        console.error('Error unsubscribing from newsletter:', error);
      }
    });
  }
}
