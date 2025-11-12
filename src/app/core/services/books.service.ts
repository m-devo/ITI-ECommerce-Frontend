import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { environment } from '../../../environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class BookService {
  constructor(private http: HttpClient) { }
  getBooks(page: number = 1, limit: number = 10): Observable<any> {
    return this.http.get(`http://localhost:4000/api/admin/book/allBooks?page=${page}&limit=${limit}`);
  }
  getBooksBYId(id: string) {
    return this.http.get(`${environment.apiUrl}/admin/book/getOneBook/${id}`)
  }

  updateBooks(id: string, body: any) {
    return this.http.patch(`${environment.apiUrl}/admin/book/update/${id}`, body);
  }

  deleteBooks(id: string) {
    return this.http.delete(`${environment.apiUrl}/admin/book/delete/${id}`);
  }
  createBooks(newBook: any) {
    return this.http.post(`${environment.apiUrl}/admin/book/create`, newBook);
  }

}

