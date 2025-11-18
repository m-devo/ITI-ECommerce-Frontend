import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { UsersService } from '../../../core/services/users.service';
import { Book } from '../../../core/models/api-models';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-books',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './books.component.html',
})
export class BooksComponent implements OnInit {
  books: Book[] = [];
  isLoading = true;
  error: string | null = null;

  constructor(private usersService: UsersService, private http: HttpClient) {}

  ngOnInit(): void {
    this.loadUserBooks();
  }

  loadUserBooks(): void {
    this.usersService.getUserBooks().subscribe({
      next: (response) => {
        if (response.success && response.data) {
          this.books = response.data;
        } else {
          this.error = response.message || 'Failed to load books';
        }
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading books:', error);
        this.error = 'Failed to load books data';
        this.isLoading = false;
      }
    });
  }

  getAvailableBooksCount(): number {
    return this.books.filter(book => book.stock > 0).length;
  }

  getCategoriesCount(): number {
    const categories = new Set(this.books.map(book => book.category));
    return categories.size;
  }


}
