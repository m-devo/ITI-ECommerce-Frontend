import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment.prod';

const URL = `${environment.apiUrl}`;
@Injectable({
  providedIn: 'root',
})
export class BookService {
  constructor(private http: HttpClient) {}

  getBooks(currentPage: number, limit: number): Observable<any[]> {
    return this.http.get<any[]>('/api/books');
  }

  getBookById(id: string): Observable<any> {
    return this.http.get<any>(`${environment.apiUrl}/public/books/${id}`);
  }

  // Shop Page
  getPublicBooks(params: any = {}): Observable<any> {
    return this.http.get(`${URL}/public/books`, { params: params });
  }
  ////////////////////Home Page/////////////////
  getHomePageData(): Observable<any> {
    return this.http.get(`${URL}/features/homepage`);
  }

  getFilterdBooks(params: any): Observable<any> {
    return this.http.get(`${URL}/search/facets`, { params: params });
  }

  getSearchSuggestions(query: string): Observable<any> {
    return this.http.get(`${URL}/search/suggest`, {
      params: { query: query },
    });
  }

  //news
  subscribeToNewsletter(email: string): Observable<any> {
    return this.http.post(`${URL}/news/subscribe`, { email: email });
  }

  unsubscribeFromNewsletter(): Observable<any> {
    return this.http.patch(`${URL}/news/unsubscribe`, {});
  }
}
