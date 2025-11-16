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

import { ComplaintService } from '../../../../core/services/complaint.service';
import { AuthService } from '../../../../core/services/auth.service';

import { BehaviorSubject, Observable, of } from 'rxjs';
import { catchError, finalize, map, tap } from 'rxjs/operators';
import { MatCard, MatCardSubtitle, MatCardHeader, MatCardTitle, MatCardContent } from "@angular/material/card";
import { MatChip } from "@angular/material/chips";
import { MatDivider } from "@angular/material/divider";
import { StatusBgPipe } from '../../../../core/pipes/status-bg.pipe';

@Component({
  selector: 'app-complaint-details',
  standalone:true,
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
    MatCard,
    MatCardSubtitle,
    MatCardHeader,
    MatCardTitle,
    MatCardContent,
    MatChip,
    MatDivider,
    StatusBgPipe,
],
  templateUrl: './complaint-details.html',
  styleUrl: './complaint-details.css',
})
export class ComplaintDetails implements OnInit{
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
    replyMessage: new FormControl('', Validators.required)
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
    this.complaintService.getComplaintById(this.complaintId!).pipe(
      map(response => response.data.complaint),
      tap(complaint => this.complaintSubject.next(complaint)),
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

    const replyMessage = this.replyForm.value.replyMessage!;
    this.complaintService.replyToComplaint(this.complaintId, replyMessage).subscribe({
      next: (response) => {
        this.snackBar.open(response.message, 'OK', { duration: 3000 });
        this.replyForm.reset();

        this.complaintSubject.next(response.data.complaint);
      },
      error: (err) => {
        this.snackBar.open(err.error.message, 'Close', { duration: 3000 });
      }
    });
  }

}
