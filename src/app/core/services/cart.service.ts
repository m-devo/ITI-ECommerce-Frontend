import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, catchError, filter, Observable, of, pairwise, startWith, tap } from 'rxjs';
import { AuthService } from './auth.service';
import { MatDialog } from '@angular/material/dialog';
import { MiniCart } from '../../shared/components/mini-cart/mini-cart';
import { LoginPrompt } from '../../shared/components/login-prompt/login-prompt';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class CartService {

  private cartItems: any[] = [];
  private cartSubject = new BehaviorSubject<any[]>(this.cartItems);

  getCart() {
    return this.cartSubject.asObservable();
  }
  // -------------------------------------
  private snackBar = inject(MatSnackBar);

  private http = inject(HttpClient)
  private authService = inject(AuthService)
  private dialog = inject(MatDialog)

  private URL = "http://localhost:4000/api/cart"

  private cartState = new BehaviorSubject<any | null>(null)
  public cart$ = this.cartState.asObservable()

  private cartItemsCount = new BehaviorSubject<number>(0)
  public cartItemsCount$ = this.cartItemsCount.asObservable()
  private cartIsLoading = new BehaviorSubject<boolean>(false);
  public cartIsLoading$ = this.cartIsLoading.asObservable();

  constructor() {
this.authService.isLoggedIn$.pipe(
      startWith(null as boolean | null),
      pairwise(),
    ).subscribe(([prevIsLoggedIn, currIsLoggedIn]) => {

      if (currIsLoggedIn === true) {
        this.loadCart();
      }
      else if (prevIsLoggedIn === true && currIsLoggedIn === false) {
        this.cartState.next(null);
        this.cartItemsCount.next(0);
      }
  });
}

loadCart(): void {
  console.log( "%cloadCart started", "color: pink; font-weight: bold;");
  this.cartIsLoading.next(true);

  this.http.get<any>(this.URL).pipe(
    tap(Response => {
      console.log("%c Data has been retreived sucessfully", "color: green; font-weight: bold;", Response);

      const cart = Response?.data?.cart || Response?.data;
      if(cart && cart.items) {
        const normalizedCart = this.normalizeCart(cart);
        this.cartState.next(normalizedCart);
        this.cartItemsCount.next(this.calculateTotalQuantity(normalizedCart.items));
      } else {
        console.warn("%c Request is success but data type is worng[CartService]", Response);
        this.cartState.next(null)
        this.cartItemsCount.next(0)
      }
      this.cartIsLoading.next(false);
    }),
    catchError(error =>{
      console.error("%c Cart Service has failed [GET]","color: red; font-weight: bold;", error);
      this.cartState.next(null)
      this.cartItemsCount.next(0)
      this.cartIsLoading.next(false);
      return of(null)
    })
  ).subscribe();
}addItem(book: any, quantity: number = 1): void {
const isLoggedIn = this.authService.isLoggedIn();

  if (!isLoggedIn) {
    this.dialog.open(LoginPrompt, { width: '380px', autoFocus: false });
    return;
  }

  const bookId = book._id;

  this.http.put<any>(`${this.URL}/items/${bookId}/increment`, { quantity })
    .pipe(
      tap((res) => {
        const cart = res?.data?.cart || res?.data;
        if (!cart) {
          console.error('Cart response malformed:', res);
          return;
        }

        const normalized = this.normalizeCart(cart);
        this.cartState.next(normalized);
        this.cartItemsCount.next(this.calculateTotalQuantity(normalized.items));

        this.snackBar.open(`Added "${book.title}" x${quantity} to cart`, 'View Cart', {
          duration: 3000,
          horizontalPosition: 'center',
          verticalPosition: 'top',
        }).onAction().subscribe(() => this.openMiniCart());
      }),
      catchError((err) => {
        console.error('Error adding item:', err);
        return of(null);
      })
    )
    .subscribe();
}

  openMiniCart() : void {
    const cartData = this.cartState.getValue()
      this.dialog.open(MiniCart, {
        data: cartData,
        width: "400px",
        position: {top: "80px", right: "20px"},
        panelClass: "mini-cart-dialog"
      })
  }

  removeItem(bookId: string): Observable<any> {
    return this.http.delete<any>(`${this.URL}/items/${bookId}`).pipe(
      tap(response => {
        if (response && response.data) {
          const rawCart = response.data;
          const normalizedCart = this.normalizeCart(rawCart);

          this.cartState.next(normalizedCart);
          this.cartItemsCount.next(this.calculateTotalQuantity(normalizedCart.items));
        }
      }),
      catchError(error => {
        console.error('Failed to remove item.');
        return of(null);
      })
    );
  }

  private calculateTotalQuantity(items: any[]): number {
    if (!items || items.length === 0) {
      return 0;
    }
    return items.reduce((total, item: any) => total + item.quantity, 0);
  }

  private normalizeCart(rawCart: any): any {
    if (!rawCart) {
      return { items: [] };
    }
    if (!rawCart.items) {
       return { ...rawCart, items: [] };
    }

    const normalizedItems = rawCart.items.map((item: any) => {
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
    });

    return { ...rawCart, items: normalizedItems };
  }

  public getCartValue(): any | null {
    return this.cartState.getValue();
  }
}
