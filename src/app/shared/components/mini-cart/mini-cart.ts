import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { MatButton, MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';

import { MatDialogRef } from '@angular/material/dialog';
import { CartService } from '../../../core/services/cart.service';
import { Observable } from 'rxjs';


@Component({
  selector: 'app-mini-cart',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    RouterLink,
    MatDialogModule
  ],
  templateUrl: './mini-cart.html',
  styleUrl: './mini-cart.css',
})
export class MiniCart {
  public cartService = inject(CartService)
  public dialogRef = inject(MatDialogRef<MiniCart>)

  public cart$: Observable<any |null>

  constructor () {
    this.cart$ = this.cartService.cart$
  }


removeItem (bookId: string) {
    this.cartService.removeItem(bookId).subscribe(() => {
    const currentCart = this.cartService.getCartValue();
      if (currentCart && currentCart.items.length === 0) {
        this.closeModal();
      }
    });
  }

  calculateSubtotal(items: any[]): number {
    if (!items || items.length === 0) {
      return 0;
    }
    return items.reduce((total, item: any) => {
      return total + (item.book.price * item.quantity);
    }, 0);
  }
  closeModal() {
    this.dialogRef.close()
  }
}
