import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

import { ReactiveFormsModule, FormControl } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { BookService } from '../../../core/services/book.service';
import { Observable, of } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap, map, catchError } from 'rxjs/operators';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-search-modal',
  standalone:true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    RouterModule,
    MatProgressSpinnerModule,
    ReactiveFormsModule
  ],
  templateUrl: './search-modal.html',
  styleUrl: './search-modal.css',
})

export class SearchModal implements OnInit {

  searchControl = new FormControl('');

  suggestions$!: Observable<any[]>;
  isLoading = false;

  private bookService = inject(BookService);

  constructor(
    public dialogRef: MatDialogRef<SearchModal>
  ) {}

  ngOnInit(): void {
    this.suggestions$ = this.searchControl.valueChanges.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      switchMap(query => {
        if (!query || query.trim().length < 2) {
          this.isLoading = false;
          return of([]);
        }
        this.isLoading = true;
        return this.bookService.getSearchSuggestions(query).pipe(
          map(response => {
            this.isLoading = false;
            return response.data;
          }),
          catchError(() => {
            this.isLoading = false;
            return of([]);
          })
        );
      })
    );
  }

  closeModal(): void {
    this.dialogRef.close();
  }

  onSuggestionClicked(): void {
    this.closeModal();
  }
}
