import { AfterViewInit, Component, inject, OnInit, ViewChild } from '@angular/core';
import { catchError, finalize, map, merge, startWith, of } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ComplaintService } from '../../../../core/services/complaint.service';
import { Router } from '@angular/router';

import { CommonModule, DatePipe } from '@angular/common';
import { ReactiveFormsModule, FormControl } from '@angular/forms';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatChipsModule } from '@angular/material/chips';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { StatusBgPipe } from '../../../../core/pipes/status-bg.pipe';
import { AdminlayoutComponent } from '../../../admin/adminlayout/adminlayout.component';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'app-admin-complaints',
  standalone:true,
  imports: [
    CommonModule,
    DatePipe,
    ReactiveFormsModule,
    MatTableModule,
    MatPaginatorModule,
    MatProgressSpinnerModule,
    MatChipsModule,
    MatFormFieldModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    StatusBgPipe,
    AdminlayoutComponent,
    MatTooltipModule
  ],
  templateUrl: './admin-complaints.html',
  styleUrl: './admin-complaints.css',
})
export class AdminComplaints implements OnInit, AfterViewInit {

  private complaintService = inject(ComplaintService);
  private snackBar = inject(MatSnackBar);
  private router = inject(Router);

  displayedColumns: string[] = ['ticketId', 'user', 'status', 'details', 'lastUpdated', 'actions'];
  dataSource = new MatTableDataSource<any>([]);

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  statusFilter = new FormControl('all');

  isLoading = true;
  totalComplaints = 0;

  ngOnInit(): void {
    this.statusFilter.valueChanges.subscribe(() => {
      if (this.paginator) {
        this.paginator.pageIndex = 0;
      }
      this.loadComplaints();
    });
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;

    merge(this.paginator.page, this.statusFilter.valueChanges)
      .pipe(
        startWith({})
            )
      .subscribe(() => this.loadComplaints());
  }

  loadComplaints(): void {
    this.isLoading = true;

    const page = this.paginator ? this.paginator.pageIndex + 1 : 1;
    const limit = this.paginator ? this.paginator.pageSize : 10;
    const status = this.statusFilter.value === 'all' ? null : this.statusFilter.value;

    this.complaintService.getAllComplaints(page, limit, status).pipe(
      map(response => response.data),
      catchError(err => {
        this.snackBar.open(err.error?.message || 'Failed to load complaints', 'Close', { duration: 3000 });
        return of(null);
      }),
      finalize(() => this.isLoading = false)
    ).subscribe(data => {
      if (data) {
        this.dataSource.data = data.complaints;
        this.totalComplaints = data.totalComplaints;
      }
    });
  }

  navigateToDetails(id: string): void {
    this.router.navigate(['/admin/complaint', id]);
  }

}
