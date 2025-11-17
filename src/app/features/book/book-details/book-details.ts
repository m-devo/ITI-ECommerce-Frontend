import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SearchComponent } from '../search/search';
import { BookService } from '../../../core/services/book.service';
import { CartService } from '../../../core/services/cart.service';
import { Book } from '../../../core/services/search.service';
import { ActivatedRoute, Router } from '@angular/router';
import {MatTabsModule} from '@angular/material/tabs';
import{ BookReviewsComponent} from '../book-reviews/book-reviews'
import{ AddReviews} from '../add-reviews/add-reviews'

@Component({
  selector: 'app-book-details',
  standalone: true,
  imports: [CommonModule, HttpClientModule, FormsModule, SearchComponent,MatTabsModule, AddReviews , BookReviewsComponent ],
  templateUrl:'./book-details.html',
  styleUrl: './book-details.css',
})

export class BookDetails implements OnInit {
  book!: Book;
  isInCart: boolean = false;
  quantity = 1;

  constructor(
    private service: BookService,
    private cartService: CartService ,
    private route: ActivatedRoute,
    private Rrouter: Router
  ) {}
 //68e7ed98aa7000812ffe6213
  ngOnInit() {
    
    this.route.paramMap.subscribe(params => {
    const id = params.get('id');
    if (id) {
      this.service.getBookById(id).subscribe(data => {
        this.book = data.book;

        // Now check cart AFTER book is loaded
        this.cartService.getCart().subscribe(cart => {
          this.isInCart = this.cartService.isInCart(this.book._id);

          if (this.isInCart) {
            this.quantity = this.cartService.getItemQuantity(this.book._id);
          }
        });

      });
    }
  });

  }

  getStarArray() {
    return [1, 2, 3, 4, 5];
  }

updateQuantity() {
  if (this.isInCart) {
    this.cartService.addToCart(this.book._id, this.quantity);

  }
}


  addToCart() {
  if (!this.isInCart) {
    this.cartService.addToCart(this.book._id, this.quantity);
    this.isInCart = true;
  } else {
    this.Rrouter.navigate(['/cart']);
  }

  }
}
