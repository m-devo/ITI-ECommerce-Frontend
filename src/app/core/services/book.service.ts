import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

const URL = 'http://localhost:4000';
@Injectable({
  providedIn: 'root'
})
export class BookService {

  constructor(private http: HttpClient) {}
  
  getBooks(currentPage: number, limit: number): Observable<any[]> {
    return this.http.get<any[]>('/api/books');
  }
  getBookById(id: number): Observable<any> {
    return this.http.get<any>(`/api/books/${id}`);
  }

// Shop Page
getPublicBooks(params: any = {}): Observable<any> {
    return this.http.get(`${URL}/api/public/books`, { params: params });
  }
  ////////////////////Home Page/////////////////
  getHomePageData(): Observable<any> {
    return this.http.get(`${URL}/api/features/homepage`);
  }

  getFilterdBooks(params: any): Observable<any>{
    return this.http.get(`${URL}/api/search/facets`, {params: params})
  }

  getSearchSuggestions(query: string): Observable<any> {
    return this.http.get(`${URL}/api/search/suggest`, {
      params: { query: query }
    });
  }

  //news
  subscribeToNewsletter(email: string): Observable<any> {
    return this.http.post(`${URL}/api/news/subscribe`, { email: email });
  }

  unsubscribeFromNewsletter(): Observable<any> {
    return this.http.patch(`${URL}/api/news/unsubscribe`, {});
  }
}
