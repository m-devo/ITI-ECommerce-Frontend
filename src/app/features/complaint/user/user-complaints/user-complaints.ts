import { Component, OnInit, inject } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { ComplaintService } from '../../../../core/services/complaint.service';
import { of } from 'rxjs';
import { catchError, finalize, map } from 'rxjs/operators';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { NewComplaintDialog } from '../../../../shared/components/new-complaint-dialog/new-complaint-dialog';

import { MatTabsModule } from '@angular/material/tabs';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatDivider } from "@angular/material/divider";
import { StatusBgPipe } from '../../../../core/pipes/status-bg.pipe';

@Component({
  selector: 'app-user-complaints',
  standalone:true,
  imports: [
    CommonModule,
    MatProgressSpinnerModule,
    MatButtonModule,
    MatIconModule,
    RouterLink,
    MatDialogModule,
    MatSnackBarModule,
    DatePipe,
    MatTabsModule,
    MatCardModule,
    MatChipsModule,
    MatDivider,
    StatusBgPipe,
],
  templateUrl: './user-complaints.html',
  styleUrl: './user-complaints.css',
})

export class UserComplaints implements OnInit{
  private complaintService = inject(ComplaintService);
  private dialog = inject(MatDialog);
  private snackBar = inject(MatSnackBar);

  public openComplaints: any[] = [];
  public closedComplaints: any[] = [];

  public isLoading = true;
  public hasOpenComplaint = false;

  ngOnInit(): void {
    this.loadComplaints();
  }

  loadComplaints(): void {
    this.isLoading = true;

    this.complaintService.getUserComplaints().pipe(
      map(response => response.data.complaints),
      catchError((err) => {
        this.snackBar.open(err.error?.message || 'Failed to load complaints', 'Close', { duration: 3000 });
        return of([]);
      }),
      finalize(() => {
        this.isLoading = false;
      })
    ).subscribe(allComplaints => {

      this.hasOpenComplaint = allComplaints.some(
        (c: any) => c.status === 'new' || c.status === 'inProgress'
      );

      this.openComplaints = allComplaints.filter(
        (c: any) => c.status === 'new' || c.status === 'inProgress'
      ).sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

      this.closedComplaints = allComplaints.filter(
        (c: any) => c.status === 'resolved' || c.status === 'closed'
      ).sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    });
  }

  openNewComplaintDialog(): void {
    if (this.hasOpenComplaint) {
      this.snackBar.open('You already have an open complaint. Please wait for it to be resolved.',
        'Close', { duration: 3000 });
      return;
    }

    const dialogRef = this.dialog.open(NewComplaintDialog, {
      width: '500px',
      autoFocus: false,
      panelClass: 'tailwind-dialog-container'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result && result.details) {
        this.submitNewComplaint(result.details);
      }
    });
  }

  submitNewComplaint(details: string): void {
    this.complaintService.createNewComplaint(details).subscribe({
      next: (response) => {
        this.snackBar.open(response.message, 'OK', { duration: 3000 });
        this.loadComplaints();
      },
      error: (err) => {
        this.snackBar.open(err.error.message, 'Close', { duration: 3000 });
      }
    });
  }
}
