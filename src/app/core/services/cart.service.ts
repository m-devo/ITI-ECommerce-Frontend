// cart.service.ts
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

// Simple interfaces
export interface Book {
  _id: string;
  title: string;
  author: string;
  price: number;
  stock: number;
  imagePath?: string;
}

export interface CartItem {
  quantity: number;
  book: Book;
}

export interface CartData {
  _id: string;
  userId: string;
  items: CartItem[];
}

export interface ApiResponse {
  statusCode: number;
  message: string;
  success: boolean;
  data: CartData;
}


@Injectable({
  providedIn: 'root'
})
export class CartService {
  // Store cart items
  private cartItems: CartItem[] = [];
  private cartSubject = new BehaviorSubject<CartItem[]>([]);

  constructor(private http: HttpClient) {
    // Load cart when service starts
    this.loadCart();
  }

  // Get cart items as observable
  getCart(): Observable<CartItem[]> {
    return this.cartSubject.asObservable();
  }

  // Get current cart items
  getCartItems(): CartItem[] {
    return this.cartItems;
  }

  // Get total number of items in cart
  getTotalItems(): number {
      return this.cartItems.reduce((t, i) => t + (i.book.price * i.quantity), 0);
  }

  // Get total price of all items
getTotalPrice(): number {
      return this.cartItems.reduce((t, i) => t + (i.book.price * i.quantity), 0);

}
  // Load cart from backend
  loadCart() {
    this.http.get<ApiResponse>(`${environment.apiUrl}/cart`).subscribe({
      next: (response) => {
        if (response.success) {
          this.cartItems = response.data.items || [];
          this.cartSubject.next(this.cartItems);
        }
      },
      error: (error) => {
        console.error('Error loading cart:', error);
      }
    });
  }

  // Add item to cart
  addToCart(bookId: string, quantity: number) {
     const data = [
    {
      bookId,
      quantity
    }
  ];

    this.http.put<ApiResponse>(`${environment.apiUrl}/cart/update`, data).subscribe({
      next: (response) => {
        if (response.success) {
          this.cartItems = response.data.items;
          this.cartSubject.next(this.cartItems);
          console.log('Item added to cart');
        }
      },
      error: (error) => {
        console.error('Error adding to cart:', error);
        alert('Could not add item to cart');
      }
    });
  }

  // Increase quantity by 1
  incrementItem(bookId: string) {
    this.http.put<ApiResponse>(
      `${environment.apiUrl}/cart/items/${bookId}/increment`,
      {}
    ).subscribe({
      next: (response) => {
        if (response.success) {
          this.cartItems = response.data.items;
          this.cartSubject.next(this.cartItems);
        }
      },
      error: (error) => {
        console.error('Error incrementing item:', error);
      }
    });
  }

  // Decrease quantity by 1
  decrementItem(bookId: string) {
    this.http.put<ApiResponse>(
      `${environment.apiUrl}/cart/items/${bookId}/decrement`,
      {}
    ).subscribe({
      next: (response) => {
        if (response.success) {
          this.cartItems = response.data.items;
          this.cartSubject.next(this.cartItems);
        }
      },
      error: (error) => {
        console.error('Error decrementing item:', error);
      }
    });
  }

  // Check if book is in cart
  isInCart(bookId: string): boolean {
        return this.cartItems.some(item => item.book._id === bookId);

  }

  // Get quantity of specific item
  getItemQuantity(bookId: string): number {
    const item = this.cartItems.find(i => i.book._id === bookId);
    return item ? item.quantity : 0;
  }
}