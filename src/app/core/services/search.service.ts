import { Injectable } from '@angular/core';
import { HttpClient,HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment.prod';


export interface Book {
  _id: string;
  title: string;
  author: string;
  description: string;
  category: string;
  price: number;
  stock: number;
  imagePath: string;
  uploadedAt: Date;
  averageRating: number;
  reviewCount: number;
  isDeleted: boolean;
}

export interface SearchFilters {
  query?: string;
  author?: string;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
}
interface ApiResponse {
  statusCode: number;
  message: string;
  success: boolean;
  data: Book[];
}

@Injectable({
  providedIn: 'root',
})
export class SearchService {
  constructor(private http: HttpClient ) {}

  // Basic full-text search
  basicSearch(query: string): Observable<ApiResponse> {
    return this.http.get<ApiResponse>(`${environment.apiUrl}/search?query=${encodeURIComponent(query)}`);
  }

  // Autocomplete suggestions
  suggestSearch(query: string): Observable<ApiResponse> {
    return this.http.get<ApiResponse>(`${environment.apiUrl}/search/suggest?query=${encodeURIComponent(query)}`);
  }

  // Faceted/filtered search
  filteredSearch(filters: SearchFilters): Observable<ApiResponse> {
    let params = new HttpParams();
    
    if (filters.query) params = params.set('query', filters.query);
    if (filters.author) params = params.set('author', filters.author);
    if (filters.category) params = params.set('category', filters.category);
    if (filters.minPrice !== undefined) params = params.set('minPrice', filters.minPrice.toString());
    if (filters.maxPrice !== undefined) params = params.set('maxPrice', filters.maxPrice.toString());

    return this.http.get<ApiResponse>(`${environment.apiUrl}/search/facets`, { params });
  }
}
