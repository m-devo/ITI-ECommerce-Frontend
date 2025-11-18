import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment.prod';

@Injectable({
  providedIn: 'root',
})
export class BookService {
  constructor(private http: HttpClient) {}

  getBooks(): Observable<any[]> {
    return this.http.get<any[]>(`${environment.apiUrl}/public/books`);
  }


// Get book details by ID
  getBookById(id: string): Observable<any> {
    return this.http.get<any>(`${environment.apiUrl}/public/books/${id}`);
  }
}
