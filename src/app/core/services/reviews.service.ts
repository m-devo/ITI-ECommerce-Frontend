import { Injectable } from '@angular/core';
import { HttpClient,HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment.prod';
import { AuthService } from './auth.service';
export interface Review{
 _id: string;
  book: string;
  user: string;
  rating: number;
  comment: string;
  audioUrl?: string;
  transcription?: string;
  createdAt: string; // keep as string for template and formatDate
  updatedAt: string;
}
// export interface SearchFilters {
//   query?: string;
//   author?: string;
//   category?: string;
//   minPrice?: number;
//   maxPrice?: number;
// }
export interface ApiResponse {
  statusCode: number;
  message: string;
  success: boolean;
  data: Review[];
}

@Injectable({
  providedIn: 'root',
})
export class ReviewsService {
  
  private baseUrl = `${environment.apiUrl}/reviews`;

  constructor(private http: HttpClient, private authService: AuthService ) {}

  // Create a new review (text or audio)
  addReview(reviewData: FormData): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(`${this.baseUrl}/add`, reviewData)
     
  }

  // Get all reviews for a specific book
  getReviewsByBook(bookId: string): Observable<ApiResponse> {
    return this.http.get<ApiResponse>(`${this.baseUrl}/book/${bookId}`)
  }

  //  Get all reviews by a specific user
  getReviewsByUser(userId: string): Observable<ApiResponse> {
    return this.http.get<ApiResponse>(`${this.baseUrl}/user/${userId}`)
  }

  // Update a review (supports audio or text)
  updateReview(id: string, updatedData: FormData): Observable<ApiResponse> {
    return this.http.put<ApiResponse>(`${this.baseUrl}/edit/${id}`, updatedData)
  }

  // Delete a review (by owner or admin)
  deleteReview(id: string): Observable<ApiResponse> {
    return this.http.delete<ApiResponse>(`${this.baseUrl}/delete/${id}`)
  }
  // Check if the current user is the owner of a review
  isReviewOwner(reviewUserId: string): boolean {
  const currentUserId = this.authService.getUserId();
  return currentUserId === reviewUserId;
}



}
