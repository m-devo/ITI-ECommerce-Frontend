import { Component, OnInit, inject } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatSelectModule } from '@angular/material/select';

import { ComplaintService } from '../../../../core/services/complaint.service';
import { AuthService } from '../../../../core/services/auth.service';

import { BehaviorSubject, of } from 'rxjs';
import { catchError, finalize, map, tap } from 'rxjs/operators';
import { StatusBgPipe } from '../../../../core/pipes/status-bg.pipe';
import { AdminlayoutComponent } from '../../../admin/adminlayout/adminlayout.component';

@Component({
  selector: 'app-admin-complaint-details',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    ReactiveFormsModule,
    DatePipe,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    MatCardModule,
    MatChipsModule,
    MatSelectModule,
    StatusBgPipe,
    AdminlayoutComponent
  ],
  templateUrl: './admin-complaint-details.html',
  styleUrl: './admin-complaint-details.css'
})
export class AdminComplaintDetails implements OnInit {

  private complaintService = inject(ComplaintService);
  private authService = inject(AuthService);
  private route = inject(ActivatedRoute);
  private snackBar = inject(MatSnackBar);

  private complaintSubject = new BehaviorSubject<any>(null);
  public complaint$ = this.complaintSubject.asObservable();

  public isLoading = new BehaviorSubject<boolean>(true);
  public complaintId: string | null = null;
  public currentUserId: string | null = null;

  replyForm = new FormGroup({
    replyMessage: new FormControl('', [Validators.required]),
    newStatus: new FormControl('', [Validators.required])
  });

  ngOnInit(): void {
    this.complaintId = this.route.snapshot.paramMap.get('id');
    this.currentUserId = this.authService.getCurrentUserId();

    if (this.complaintId) {
      this.loadComplaint();
    } else {
      this.isLoading.next(false);
      this.snackBar.open('Invalid complaint ID', 'Close', { duration: 3000 });
    }
  }

  loadComplaint(): void {
    this.isLoading.next(true);

    this.complaintService.getAdminComplaintById(this.complaintId!).pipe(
      map(response => response.data.complaint),
      tap(complaint => {
        this.complaintSubject.next(complaint);
        this.replyForm.controls.newStatus.setValue(complaint.status);
      }),
      catchError(err => {
        this.snackBar.open(err.error.message || 'Failed to load complaint', 'Close', { duration: 3000 });
        this.complaintSubject.next(null);
        return of(null);
      }),
      finalize(() => this.isLoading.next(false))
    ).subscribe();
  }

  submitReply(): void {
    if (this.replyForm.invalid || !this.complaintId) {
      return;
    }

    const { replyMessage, newStatus } = this.replyForm.value;

    this.complaintService.adminReplyToComplaint(this.complaintId, replyMessage!, newStatus!).subscribe({
      next: (response) => {
        this.snackBar.open(response.message, 'OK', { duration: 3000 });
        this.replyForm.controls.replyMessage.reset();

        this.complaintSubject.next(response.data.complaint);
        this.replyForm.controls.newStatus.setValue(response.data.complaint.status);
      },
      error: (err) => {
        this.snackBar.open(err.error.message, 'Close', { duration: 3000 });
      }
    });
  }

}
