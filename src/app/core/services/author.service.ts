import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class AuthorService {


  constructor(private http: HttpClient) { }

  getRequests(page: number = 1, limit: number = 10): Observable<any> {
    return this.http.get(`${environment.apiUrl}/admin/requests?page=${page}&limit=${limit}`);
  }
   getReqBYId(id:string){
    return this.http.get(`${environment.apiUrl}/admin/requests/${id}`)
  }
  deleteReq(id:string){
  return this.http.delete(`${environment.apiUrl}/admin/requests/${id}`);
}
updateReq(id: string, body: any) {
  return this.http.patch(`${environment.apiUrl}/admin/requests/${id}`, body);
}






}

