import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDividerModule } from '@angular/material/divider';
import { Subject, takeUntil } from 'rxjs';
import { CartService } from '../../../core/services/cart.service';
import { NotificationService } from '../../../core/services/notification.service';
import { Cart, CartItem, Book } from '../../../core/models/api-models';

@Component({
  selector: 'app-cart-page',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatDividerModule
  ],
  templateUrl: './cart-page.component.html',
  styleUrls: ['./cart-page.component.css']
})
export class CartPageComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  cart: Cart | null = null;
  error: string | null = null;
  totalItems = 0;
  totalPrice = 0;

  constructor(
    private cartService: CartService,
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    this.loadCart();
    this.subscribeToCartUpdates();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  get loading$() {
    return this.cartService.loading$;
  }

private loadCart(): void {
    this.error = null;
    this.cartService.getCart()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          if (!response) {
             this.error = 'Network error or service unavailable.';
             return;
          }
          if (response.statusCode === 200 && response.data) {
            this.cart = response.data;
            this.updateCartSummary();
          } else {
            this.error = response.message || 'Failed to load cart';
          }
        }
      });
  }

  private subscribeToCartUpdates(): void {
    this.cartService.cart$
      .pipe(takeUntil(this.destroy$))
      .subscribe(cart => {
        this.cart = cart;
        this.updateCartSummary();
      });
  }

  private updateCartSummary(): void {
    if (!this.cart?.items || !Array.isArray(this.cart.items)) {
      this.totalItems = 0;
      this.totalPrice = 0;
      return;
    }

    this.totalItems = this.calculateTotalItems();
    this.totalPrice = this.calculateTotalPrice();
  }

  private calculateTotalItems(): number {
    return this.cart?.items.reduce((sum, item) => sum + (item?.quantity || 0), 0) || 0;
  }

  private calculateTotalPrice(): number {
    return this.cart?.items.reduce((sum, item) =>
      sum + ((item?.book?.price || 0) * (item?.quantity || 0)), 0) || 0;
  }

  incrementItem(bookId: string): void {
    this.cartService.incrementItem(bookId)
      .pipe(takeUntil(this.destroy$))
      .subscribe();
  }

  decrementItem(bookId: string): void {
    this.cartService.decrementItem(bookId)
      .pipe(takeUntil(this.destroy$))
      .subscribe();
  }

  removeItem(bookId: string): void {
    this.cartService.removeItem(bookId)
      .pipe(takeUntil(this.destroy$))
      .subscribe();
  }

  clearCart(): void {
    this.cartService.clearCart()
      .pipe(takeUntil(this.destroy$))
      .subscribe();
  }

  retryLoadCart(): void {
    this.loadCart();
  }

  canIncrement(book: Book | undefined, quantity: number): boolean {
    if (!book || typeof book.stock !== 'number') return false;
    return book.stock > quantity;
  }

  canDecrement(quantity: number): boolean {
    return quantity > 1;
  }

  formatPrice(price: number): string {
    return `$${price.toFixed(2)}`;
  }

  trackByBookId(index: number, item: CartItem): string {
    return item?.book?._id as string || `item-${index}`;
  }

  private quantityInputs = new Map<string, number>();

  onQuantityInput(event: Event, bookId: string): void {
    const target = event.target as HTMLInputElement;
    const value = parseInt(target.value, 10);
    if (!isNaN(value) && value >= 0) {
      this.quantityInputs.set(bookId, value);
    } else {
      // If invalid value, reset to current
      const item = this.cart?.items.find(i => i.book?._id === bookId);
      if (item) {
        this.quantityInputs.set(bookId, item.quantity);
      }
    }
  }

  getQuantityInputValue(bookId: string): number {
    return this.quantityInputs.get(bookId) ?? 0;
  }

  updateQuantity(bookId: string, quantity: number): void {
    // Find the book to check stock
    const item = this.cart?.items.find(i => i.book?._id === bookId);
    if (!item?.book) return;

    // Validate input - min 1, max stock
    if (quantity < 1) {
      this.notificationService.showError('Quantity must be at least 1');
      this.quantityInputs.set(bookId, item.quantity);
      return;
    }

    if (quantity > item.book.stock) {
      this.notificationService.showError(`Only ${item.book.stock} units available`);
      this.quantityInputs.set(bookId, item.quantity);
      return;
    }

    this.cartService.updateCart([{ bookId, quantity }])
      .pipe(takeUntil(this.destroy$))
      .subscribe();
  }
}
