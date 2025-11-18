import { Component, inject, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { CartService } from '../../../core/services/cart.service';

@Component({
  selector: 'app-quick-view',
  standalone:true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule
  ],
  templateUrl: './quick-view.html',
  styleUrl: './quick-view.css',
})
export class QuickView {

book: any;
  quantity: number = 1;

private cartService = inject(CartService);
  constructor(
    public dialogRef: MatDialogRef<QuickView>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.book = data;
  }

  closeModal(): void {
    this.dialogRef.close();
  }

  incrementQuantity(): void {
    console.log('Increment Clicked');
    console.log('Current Quantity:', this.quantity);
    console.log('Book Stock:', this.book.stock);

    if (this.quantity < this.book.stock) {
      this.quantity++;
    } else {
      console.log('Cannot increment quantity. Stock limit reached.');
    }
  }

  decrementQuantity(): void {
    if (this.quantity > 1) {
      this.quantity--;
    }
  }
onAddToCart(): void {
  console.log('Book Data:', this.book);
  console.log('Quantity:', this.quantity);
  this.cartService.addItem(this.book, this.quantity);
  this.closeModal();

  }
}
