import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SearchComponent } from '../search/search';
import { BookService } from '../../../core/services/book.service';
import { CartService } from '../../../core/services/cart.service';
import { Book } from '../../../core/services/search.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MatTabsModule } from '@angular/material/tabs';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { BookReviewsComponent } from '../book-reviews/book-reviews';
import { AddReviews } from '../add-reviews/add-reviews';
import { AuthService } from '../../../core/services/auth.service';
import { MatDialog } from '@angular/material/dialog';
import { LoginPrompt } from '../../../shared/components/login-prompt/login-prompt';

@Component({
  selector: 'app-book-details',
  standalone: true,
  imports: [
    CommonModule,
    HttpClientModule,
    FormsModule,
    SearchComponent,
    MatTabsModule,
    AddReviews,
    BookReviewsComponent,
    MatProgressSpinnerModule
  ],
  templateUrl: './book-details.html',
  styleUrl: './book-details.css',
})
export class BookDetails implements OnInit {
  book!: Book;
  isInCart: boolean = false;
  quantity = 1;

  constructor(
    private service: BookService,
    private cartService: CartService,
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService,
    private dialog: MatDialog
  ) { }

  ngOnInit() {
    this.route.paramMap.subscribe((params) => {
      const id = params.get('id');
      console.log('Book ID from route:', id);
      if (id) {
        this.service.getBookById(id).subscribe({
          next: (data) => {
            console.log('Book data:', data);
            this.book = data.book;

            this.cartService.getCart().subscribe((cart) => {
              if (cart && cart.success && cart.data) {
                const item = cart.data.items.find((item: any) => item.book._id === this.book._id);
                this.isInCart = !!item;
                if (item) {
                  this.quantity = item.quantity;
                }
              }
            });
          },
          error: (err) => {
            console.error('Error fetching book:', err);
            this.router.navigate(['/NotFound']);
          },
        });
      }
    });
  }

  getStarArray() {
    return [1, 2, 3, 4, 5];
  }

  updateQuantity() {
    if (this.isInCart) {
      this.cartService.updateItemQuantity(this.book._id, this.quantity);
    }
  }

  addToCart() {
    if (!this.authService.isLoggedIn()) {
      this.dialog.open(LoginPrompt, { width: '380px', autoFocus: false });
      return;
    }
    if (!this.isInCart) {
      this.cartService.addItem(this.book, this.quantity);
      this.isInCart = true;
    } else {
      this.router.navigate(['/cart']);
    }
  }
}
