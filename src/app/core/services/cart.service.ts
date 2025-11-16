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
