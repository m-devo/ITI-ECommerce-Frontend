import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ComplaintService {
  private http = inject(HttpClient);
  private URL = "http://localhost:4000/api/complaints";

  constructor() { }

  /*
    GET /api/complaints/user // get user complaint + pagination
   */
  getUserComplaints(page: number = 1, limit: number = 10): Observable<any> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('limit', limit.toString());

    return this.http.get<any>(`${this.URL}/user`, { params });
  }

  /*
   GET /api/complaints/user/:id get user complaint by id
   */
  getComplaintById(id: string): Observable<any> {
    return this.http.get<any>(`${this.URL}/user/${id}`);
  }

  /*
   POST /api/complaints/user user create new complaing
   */
  createNewComplaint(details: string, orderId: string | null = null): Observable<any> {
    const body = {
      details: details,
      orderId: orderId
    };
    return this.http.post<any>(`${this.URL}/user/create`, body); // create
  }

  /**
   POST /api/complaints/user/:id/reply // user reply to a complaint
   */
  replyToComplaint(id: string, replyMessage: string): Observable<any> {
    const body = { replyMessage: replyMessage };
    return this.http.post<any>(`${this.URL}/user/${id}/reply`, body);
  }
  // Admin

  /*
   /api/complaints/
   */
  getAllComplaints(page: number = 1, limit: number = 10, status: string | null = null): Observable<any> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('limit', limit.toString());

    if (status) {
      params = params.set('status', status);
    }

    return this.http.get<any>(this.URL, { params });
  }

  /*
   *GET /api/complaints/:id
   */
  getAdminComplaintById(id: string): Observable<any> {
    return this.http.get<any>(`${this.URL}/${id}`);
  }

  /*
   POST /api/complaints/:id/reply
   */
  adminReplyToComplaint(id: string, replyMessage: string, newStatus: string): Observable<any> {
    const body = {
      replyMessage: replyMessage,
      newStatus: newStatus
    };

    return this.http.post<any>(`${this.URL}/${id}/reply`, body);
  }
}
