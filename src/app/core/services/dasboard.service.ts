import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { UsersService } from './users.service';

@Injectable({
    providedIn: 'root'
})
export class DashboardService {
  private totalUsersSource = new BehaviorSubject<number>(0);
  totalUsers$ = this.totalUsersSource.asObservable();

  private first10UsersSource = new BehaviorSubject<any[]>([]);
  first10Users$ = this.first10UsersSource.asObservable();

  constructor(private userService: UsersService) {
    this.loadInitialData();
  }

  loadInitialData() {
    this.userService.getUsers(1, 10).subscribe((res: any) => {
      const total = res.data.total;
      const first10 = res.data.users;

      this.totalUsersSource.next(total);
      this.first10UsersSource.next(first10);
    });
  }

  setTotalUsers(total: number) {
    this.totalUsersSource.next(total);
  }

  setFirst10Users(users: any[]) {
    this.first10UsersSource.next(users);
  }
}
