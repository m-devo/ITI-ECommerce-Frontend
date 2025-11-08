import { AfterViewInit, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Chart } from 'chart.js/auto';
import { AdminlayoutComponent } from '../adminlayout/adminlayout.component';
import { DashboardService } from '../../../core/services/dasboard.service';
@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule,
    RouterModule, AdminlayoutComponent
  ],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  totalUsers: number = 0;
  userService: any;
  first_Users: any[] = [];

  constructor(private dashboardService: DashboardService) { }

ngOnInit() {
  this.dashboardService.totalUsers$.subscribe(total => {
    this.totalUsers = total;
  });

  this.dashboardService.first10Users$.subscribe(users => {
    this.first_Users = users;
  });
}


  links = [
    { label: 'Dashboard', path: '/dashboard', icon: '🏠' },
    { label: 'Books', path: '/admin/books', icon: '📚' },
    { label: 'Authors', path: '/authors', icon: '✍️' },
    { label: 'Orders', path: '/orders', icon: '📦' },
    { label: 'Users', path: '/users', icon: '👥' },
  ];

  topAuthorRequests = [
    { name: 'John Doe', email: 'john@example.com', status: 'Pending' },
    { name: 'Sara Ahmed', email: 'sara@example.com', status: 'Approved' },
    { name: 'Ali Mahmoud', email: 'ali@example.com', status: 'Pending' },
    { name: 'Lina Youssef', email: 'lina@example.com', status: 'Rejected' },
    { name: 'Mark Adel', email: 'mark@example.com', status: 'Approved' },
  ];

  books = [
    { title: 'Atomic Habits', category: 'Self-help' },
    { title: 'Deep Work', category: 'Productivity' },
    { title: 'Clean Code', category: 'Programming' },
    { title: 'The Alchemist', category: 'Fiction' },
    { title: '1984', category: 'Dystopian' },
    { title: 'Rich Dad Poor Dad', category: 'Finance' },
    { title: 'Think Like a Monk', category: 'Mindfulness' },
    { title: 'The Psychology of Money', category: 'Finance' },
    { title: 'Ego is the Enemy', category: 'Philosophy' },
    { title: 'Hooked', category: 'Business' }
  ];

  orders = [
    { book: 'Atomic Habits', user: 'Omar', status: 'Completed' },
    { book: 'Deep Work', user: 'Laila', status: 'Pending' },
    { book: 'Clean Code', user: 'Ahmed', status: 'Cancelled' },
    { book: 'Rich Dad Poor Dad', user: 'Nour', status: 'Completed' },
    { book: '1984', user: 'Sarah', status: 'Pending' },
    { book: 'Ego is the Enemy', user: 'Ali', status: 'Completed' },
    { book: 'Hooked', user: 'Mona', status: 'Completed' },
    { book: 'Think Like a Monk', user: 'Youssef', status: 'Cancelled' },
    { book: 'The Alchemist', user: 'Karim', status: 'Completed' },
    { book: 'Deep Work', user: 'Farah', status: 'Pending' }
  ];

  ngAfterViewInit() {

    new Chart("salesChart", {
      type: 'line',
      data: {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May'],
        datasets: [{
          label: 'Sales',
          data: [150, 200, 180, 300, 250],
          borderColor: '#00BFC5',
          backgroundColor: 'rgba(0,191,197,0.1)',
          borderWidth: 2,
          fill: true,
          tension: 0.4
        }]
      },
      options: {
        responsive: true,
        plugins: { legend: { display: true } },
        scales: { y: { beginAtZero: true } }
      }
    });

    new Chart("categoryChart", {
      type: 'pie',
      data: {
        labels: ['General', 'AI', 'Machine Learning', 'Database'],
        datasets: [{
          data: [40, 25, 20, 15],
          backgroundColor: ['#00BFC5', '#FFB703', '#333333', '#009CA2'],
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        plugins: { legend: { position: 'bottom' } }
      }
    });

    new Chart("userGrowthChart", {
      type: 'bar',
      data: {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May'],
        datasets: [{
          label: 'Users Joined',
          data: [50, 80, 65, 120, 150],
          backgroundColor: '#FFB703',
          borderRadius: 8
        }]
      },
      options: {
        responsive: true,
        plugins: { legend: { display: false } },
        scales: { y: { beginAtZero: true } }
      }
    });
  }
}
