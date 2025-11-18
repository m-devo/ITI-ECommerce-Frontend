import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CartService } from '../../../core/services/cart.service';

@Component({
  selector: 'app-book-card',
  standalone: true,
  imports: [
    MatIconModule,
    RouterLink,
    CommonModule,
    MatButtonModule,

  ],
  templateUrl: './book-card.component.html',
  styleUrl: './book-card.component.css'
})
export class BookCardComponent {

  @Input() book: any;

  stars = [1, 2, 3, 4, 5];


  @Output() quickViewClicked = new EventEmitter<any>();

  private snackBar = inject(MatSnackBar);
  private cartService = inject(CartService);

  constructor() { }


  public encodeImageUrl(url: string): string {
    if (!url) {
      return '';
    }
    return encodeURI(url);
  }

  onClickViewClick(event: MouseEvent): void {
    event.preventDefault();
    event.stopPropagation();
  console.log('Quick view clicked!');
    this.quickViewClicked.emit(this.book)

  }

onAddToCartClick(event: MouseEvent): void {
    event.preventDefault();
    event.stopPropagation();

    console.log('Add to cart clicked!');

    if (this.book.stock === 0) {
      this.snackBar.open('This book is sold out!', 'Close', {
        duration: 3000,
        panelClass: ['sold-out-snackbar']
      });
    } else {
      this.cartService.addItem(this.book, 1);
    }
  }
}
