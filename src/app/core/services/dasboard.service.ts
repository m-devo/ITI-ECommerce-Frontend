import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { UsersService } from './users.service';
import { BookService } from './books.service';
import { OrdersService } from './order.service';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  private totalUsersSource = new BehaviorSubject<number>(0);
  totalUsers$ = this.totalUsersSource.asObservable();
  private totalBooksSource = new BehaviorSubject<number>(0);
  totalBooks$ = this.totalBooksSource.asObservable();

  private first10UsersSource = new BehaviorSubject<any[]>([]);
  first10Users$ = this.first10UsersSource.asObservable();
  private first10BooksSource = new BehaviorSubject<any[]>([]);
  first10Books$ = this.first10BooksSource.asObservable();

  private totalAuthorsSource = new BehaviorSubject<number>(0);
  totalAuthors$ = this.totalAuthorsSource.asObservable();
  private totalOrdersSource = new BehaviorSubject<number>(0);
  totalOrder$ = this.totalOrdersSource.asObservable();


  constructor(private userService: UsersService, private bookService: BookService,
    private ordersService:OrdersService
  ) {
    this.loadInitialData();
  }

  loadInitialData() {
    this.userService.getUsers(1, 10).subscribe((res: any) => {
      const total = res.data?.total || 0;
      const first10 = res.data?.users || [];

      this.totalUsersSource.next(total);
      this.first10UsersSource.next(first10);

      this.calculateAuthors(first10);
    });

    this.bookService.getBooks(1, 10).subscribe((res: any) => {
      const total = res.data?.totalBooks || 0;
      const first10 = res.data?.data || [];

      this.totalBooksSource.next(total);
      this.first10BooksSource.next(first10);
    });

    this.userService.getUsers(1, 1000).subscribe((res: any) => {
      const allUsers = res.data?.users || [];
      this.calculateAuthors(allUsers);
    });
      this.ordersService.getOrders(1, 1).subscribe((res: any) => {
    const totalOrders = res.data?.totalOrders || 0;
    this.calculateOrders(totalOrders);
  });

  }

  calculateOrders(totalOrders: number) {
    this.totalOrdersSource.next(totalOrders);
  }
  calculateAuthors(users: any[]) {
    const authorsCount = users.filter(u => u.role === 'author').length;
    this.totalAuthorsSource.next(authorsCount);
  }

  setTotalUsers(total: number) {
    this.totalUsersSource.next(total);
  }

  setFirst10Users(users: any[]) {
    this.first10UsersSource.next(users);
  }
  setTotalBooks(total: number) {
    this.totalBooksSource.next(total);
  }

  setFirst10Books(books: any[]) {
    this.first10BooksSource.next(books);
  }
}
