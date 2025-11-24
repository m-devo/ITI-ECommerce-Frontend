import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment.prod';
import { User, Order, Book, ApiResponse, AuthorRequest, CreateAuthorRequestRequest, UpdateAuthorRequestRequest } from '../models/api-models';

@Injectable({
  providedIn: 'root'
})
export class UsersService {
  constructor(private http: HttpClient) { }

  getUsers(page: number = 1, limit: number = 10): Observable<any> {
    return this.http.get(`${environment.apiUrl}/admin/users/allusers?page=${page}&limit=${limit}`);
  }
  getUserBYId(id:string){
    return this.http.get(`${environment.apiUrl}/admin/users/${id}`)
  }

updateUser(id: string, body: any) {
  return this.http.patch(`${environment.apiUrl}/admin/users/update/${id}`, body);
}

deleteUser(id:string){
  return this.http.delete(`${environment.apiUrl}/admin/users/delete/${id}`);
}

// Remove admin methods as requested

getUserProfile(): Observable<ApiResponse<User>> {
  return this.http.get<ApiResponse<User>>(`${environment.apiUrl}/user/profile`);
}

getUserOrders(): Observable<ApiResponse<Order[]>> {
  return this.http.get<ApiResponse<Order[]>>(`${environment.apiUrl}/user/orders`);
}

getUserBooks(): Observable<ApiResponse<Book[]>> {
  return this.http.get<ApiResponse<Book[]>>(`${environment.apiUrl}/user/books`);
}

// Author Request Methods
createAuthorRequest(formData: FormData): Observable<ApiResponse<AuthorRequest>> {
  return this.http.post<ApiResponse<AuthorRequest>>(`${environment.apiUrl}/user/requests`, formData);
}

getLatestAuthorRequest(): Observable<ApiResponse<AuthorRequest>> {
  return this.http.get<ApiResponse<AuthorRequest>>(`${environment.apiUrl}/user/requests`);
}

updateAuthorRequest(requestId: string, formData: FormData): Observable<ApiResponse<AuthorRequest>> {
  return this.http.patch<ApiResponse<AuthorRequest>>(`${environment.apiUrl}/user/requests/${requestId}`, formData);
}

subscribeToNewsletter(email: string): Observable<ApiResponse<any>> {
  return this.http.post<ApiResponse<any>>(`${environment.apiUrl}/news/subscribe`, { email });
}

unsubscribeFromNewsletter(): Observable<ApiResponse<any>> {
  return this.http.patch<ApiResponse<any>>(`${environment.apiUrl}/news/unsubscribe`, {});
}

}

