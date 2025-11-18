import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class OrdersService {
  constructor(private http: HttpClient) { }

  getOrders(page: number = 1, limit: number = 10): Observable<any> {
    return this.http.get(`${environment.apiUrl}/admin/order/allOrders?page=${page}&limit=${limit}`);
  }
  updateOrder(id: string, body: any) {
  return this.http.patch(`${environment.apiUrl}/admin/order/update/${id}`, body);
}

}

