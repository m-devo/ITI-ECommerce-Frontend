import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, catchError, Observable, of, pairwise, startWith, tap, map, finalize } from 'rxjs';
import { AuthService } from './auth.service';
import { MatDialog } from '@angular/material/dialog';
import { MiniCart } from '../../shared/components/mini-cart/mini-cart';
import { LoginPrompt } from '../../shared/components/login-prompt/login-prompt';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Book, Cart, ApiResponse, CartItem, CartUpdateRequest } from '../../core/models/api-models';
import { environment } from '../../../environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class CartService {

  private http = inject(HttpClient);
  private authService = inject(AuthService);
  private dialog = inject(MatDialog);
  private snackBar = inject(MatSnackBar);

  private URL = `${environment.apiUrl}/cart`
  private _cartState = new BehaviorSubject<Cart | null>(null);
  private _cartIsLoading = new BehaviorSubject<boolean>(false);

  public cart$ = this._cartState.asObservable();
  public loading$ = this._cartIsLoading.asObservable();
  public cartItemsCount$ = this.cart$.pipe(
    map(cart => this.calculateTotalQuantity(cart?.items)),
    startWith(0)
  );

  constructor() {

    this.authService.isLoggedIn$.pipe(
      startWith(null as boolean | null),
      pairwise(),
    ).subscribe(([prevIsLoggedIn, currIsLoggedIn]) => {

      if (currIsLoggedIn === true) {
                this.getCart().subscribe();
      }
      else if (prevIsLoggedIn === true && currIsLoggedIn === false) {
        this._cartState.next(null);
      }
    });
  }

  private updateCartState(response: ApiResponse<Cart>): void {
    if (!response || !response.success) {
      console.error("%c API request failed or response was falsy", "color: red; font-weight: bold;", response);
      return;
    }

    const cart = response?.data;
    if (cart) {
      const normalizedCart = this.normalizeCart(cart);
      this._cartState.next(normalizedCart);
    } else {
      console.warn("%c Request is success but data type is wrong [CartService]", "color: orange;", response);
      this._cartState.next(this.normalizeCart({ items: [] }));
    }
  }

  private calculateTotalQuantity(items: CartItem[] | undefined | null): number {
    if (!items || items.length === 0) {
      return 0;
    }
    return items.reduce((total, item: CartItem) => total + (item?.quantity || 0), 0);
  }

  private normalizeCart(rawCart: any): Cart {
    if (!rawCart) {
      return { _id: '', userId: '', items: [] };
    }
    if (!rawCart.items) {
      return { ...rawCart, items: [] };
    }

    const normalizedItems: CartItem[] = rawCart.items.map((item: any) => {
      if (item.book) {
        return item;
      }
      if (item.bookId) {
        return {
          ...item,
          book: item.bookId,
          bookId: undefined
        };
      }
      return item;
    }).filter((item: any) => item && item.book);

    return { ...rawCart, items: normalizedItems };
  }

  private handleError(operation: string) {
    return (error: any): Observable<null> => {
      console.error(`%c CartService failed [${operation}]`, "color: red; font-weight: bold;", error);
      this._cartIsLoading.next(false);
      return of(null);
    };
  }

  getCart(): Observable<ApiResponse<Cart> | null> {
    console.log("%cloadCart started", "color: pink; font-weight: bold;");
    this._cartIsLoading.next(true);
    return this.http.get<ApiResponse<Cart>>(this.URL).pipe(
      tap(response => {
        if (response?.success) {
          console.log("%c Data has been retrieved successfully", "color: green; font-weight: bold;", response);
          this.updateCartState(response);
        } else {
           console.error("%c Cart Service has failed [GET]", "color: red; font-weight: bold;",
             response?.message || 'Unknown error');
           this._cartState.next(null);
        }
      }),
      finalize(() => this._cartIsLoading.next(false)),
      catchError(this.handleError('GET /cart'))
    );
  }

  updateCart(cartItems: CartUpdateRequest[]): Observable<ApiResponse<Cart> | null> {
    this._cartIsLoading.next(true);
    return this.http.put<ApiResponse<Cart>>(`${this.URL}/update`, cartItems).pipe(
      tap(response => this.updateCartState(response)),
      finalize(() => this._cartIsLoading.next(false)),
      catchError(this.handleError('updateCart'))
    );
  }

  addItem(book: Book, quantityToAdd: number = 1): void {
    const isLoggedIn = this.authService.isLoggedIn();
    if (!isLoggedIn) {
      this.dialog.open(LoginPrompt, { width: '380px', autoFocus: false });
      return;
    }

    const currentCart = this._cartState.getValue();
    const existingItem = currentCart?.items.find((item: any) =>
       item.book?._id === book._id || item.book === book._id
    );

    let finalQuantity = quantityToAdd;
    if (existingItem) {
      finalQuantity = (existingItem.quantity || 0) + quantityToAdd;
    }

    const updateRequest: CartUpdateRequest[] = [{
      bookId: book._id,
      quantity: finalQuantity
    }];

    this.updateCart(updateRequest).pipe(
      tap(res => {
        if (res && res.success) {
          this.snackBar.open(`Added "${book.title}" to cart`, 'View Cart', {
            duration: 3000,
            horizontalPosition: 'center',
            verticalPosition: 'top',
            panelClass: 'success-snackbar'
          }).onAction().subscribe(() => this.openMiniCart());
        }
      })
    ).subscribe();
  }

updateItemQuantity(bookId: string, newQuantity: number): void {
    const isLoggedIn = this.authService.isLoggedIn();
    if (!isLoggedIn) return;

    const updateRequest: CartUpdateRequest[] = [{
      bookId: bookId,
      quantity: newQuantity
    }];

    this.updateCart(updateRequest).subscribe();
  }

  incrementItem(bookId: string): Observable<ApiResponse<Cart> | null> {
    this._cartIsLoading.next(true);
    return this.http.put<ApiResponse<Cart>>(`${this.URL}/items/${bookId}/increment`, {}).pipe(
      tap(this.updateCartState.bind(this)),
      finalize(() => this._cartIsLoading.next(false)),
      catchError(this.handleError('incrementItem'))
    );
  }

  decrementItem(bookId: string): Observable<ApiResponse<Cart> | null> {
    this._cartIsLoading.next(true);
    return this.http.put<ApiResponse<Cart>>(`${this.URL}/items/${bookId}/decrement`, {}).pipe(
      tap(this.updateCartState.bind(this)),
      finalize(() => this._cartIsLoading.next(false)),
      catchError(this.handleError('decrementItem'))
    );
  }

  removeItem(bookId: string): Observable<ApiResponse<Cart> | null> {
    this._cartIsLoading.next(true);
    return this.http.delete<ApiResponse<Cart>>(`${this.URL}/items/${bookId}`).pipe(
      tap(res => {
        this.updateCartState(res);
        this.snackBar.open('Item removed from cart', 'Close', {
          duration: 3000,
          horizontalPosition: 'center',
          verticalPosition: 'top',
          panelClass: 'error-snackbar'
        });
      }),
      finalize(() => this._cartIsLoading.next(false)),
      catchError(this.handleError('removeItem'))
    );
  }

  clearCart(): Observable<ApiResponse<Cart> | null> {
      this._cartIsLoading.next(true);
      return this.http.delete<ApiResponse<Cart>>(`${this.URL}/clear`).pipe(
          tap(this.updateCartState.bind(this)),
        finalize(() => this._cartIsLoading.next(false)),
        catchError(this.handleError('clearCart'))
      );
    }

    openMiniCart(): void {
      const cartData = this._cartState.getValue();
      this.dialog.open(MiniCart, {
        data: cartData,
        width: "400px",
        position: { top: "80px", right: "20px" },
        panelClass: "mini-cart-dialog"
      });
    }
    public getCartValue(): Cart | null {
      return this._cartState.getValue();
  }
}
