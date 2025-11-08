import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment.prod';

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

}

