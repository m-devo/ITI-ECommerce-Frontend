import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, finalize, timeout } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { tap, catchError, throwError } from 'rxjs';
import { Cart, CartItem, CartUpdateRequest, ApiResponse } from '../models/api-models';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private readonly API_URL = `${environment.apiUrl}/cart`;
  private currentCartSubject = new BehaviorSubject<Cart | null>(null);
  public cart$ = this.currentCartSubject.asObservable();
  private loadingSubject = new BehaviorSubject<boolean>(false);
  public loading$ = this.loadingSubject.asObservable();

  constructor(private http: HttpClient) {}

  private handleResponse(response: ApiResponse<Cart>): void {
    if (response?.success && response.data?._id && response.data?.items) {
      this.currentCartSubject.next(response.data);
    }
  }

  private createHttpRequest<T>(
    method: 'get' | 'post' | 'put' | 'delete',
    endpoint: string,
    body?: any
  ): Observable<ApiResponse<T>> {

    this.loadingSubject.next(true);

    const request$ =
            method === 'get' ? this.http.get<ApiResponse<T>>(`${this.API_URL}${endpoint}`) :
            method === 'post' ? this.http.post<ApiResponse<T>>(`${this.API_URL}${endpoint}`, body) :
            method === 'put' ? this.http.put<ApiResponse<T>>(`${this.API_URL}${endpoint}`, body) :
            this.http.delete<ApiResponse<T>>(`${this.API_URL}${endpoint}`);

    return request$.pipe(
      timeout(10000),
      tap(response => {
        this.handleResponse(response as ApiResponse<Cart>);
      }),
      finalize(() => this.loadingSubject.next(false)),
      catchError(error => throwError(() => error))
    );
  }


  getCart(): Observable<ApiResponse<Cart>> {
    return this.createHttpRequest<Cart>('get', '');
  }


  updateCart(cartItems: CartUpdateRequest[]): Observable<ApiResponse<Cart>> {
    return this.createHttpRequest<Cart>('put', '/update', cartItems);
  }


  removeItem(bookId: string): Observable<ApiResponse<Cart>> {
    return this.createHttpRequest<Cart>('delete', `/items/${bookId}`);
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
  const isLoggedIn = this.authService.isLoggedIn$.getValue();

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


  clearCart(): Observable<ApiResponse<Cart>> {
    return this.createHttpRequest<Cart>('delete', '/clear');
  }


  incrementItem(bookId: string): Observable<ApiResponse<Cart>> {
    return this.createHttpRequest<Cart>('put', `/items/${bookId}/increment`, {});
  }


  decrementItem(bookId: string): Observable<ApiResponse<Cart>> {
    return this.createHttpRequest<Cart>('put', `/items/${bookId}/decrement`, {});
  }


  getCurrentCart(): Cart | null {
    return this.currentCartSubject.value;
  }
}
