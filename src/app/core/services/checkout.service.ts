import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  ApiResponse,
  CheckoutPreResponse,
  CheckoutRequest,
  CheckoutResponse
} from '../models/api-models';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CheckoutService {
  private readonly BASE_URL = `${environment.apiUrl}/checkout`;

  constructor(private http: HttpClient) {}

  preCheckout(): Observable<ApiResponse<CheckoutPreResponse>> {
    return this.http.get<ApiResponse<CheckoutPreResponse>>(
      `${this.BASE_URL}/pre`,
      {}
    );
  }


  checkout(data: CheckoutRequest): Observable<ApiResponse<CheckoutResponse>> {
    // Generate a simple idempotency key
    const idempotencyKey = `cid-${Date.now()}-${Math.random().toString(36).substring(2, 10)}`;

    return this.http.post<ApiResponse<CheckoutResponse>>(
      this.BASE_URL,
      data,
      {
        headers: {
          'Idempotency-Key': idempotencyKey
        }
      }
    );
  }
}
