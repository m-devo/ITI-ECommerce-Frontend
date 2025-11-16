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
  first_Books: any[] = [];
  totalBooks: number = 0;
  totalOrders: number = 0;

  numberOfAuthor: number = 0;

  constructor(private dashboardService: DashboardService) { }

  ngOnInit() {
    this.dashboardService.totalUsers$.subscribe(total => {
      this.totalUsers = total;
    });
    this.dashboardService.totalAuthors$.subscribe(total => {
      this.numberOfAuthor = total;
    });

    this.dashboardService.first10Users$.subscribe(users => {
      this.first_Users = users;
    });
    this.dashboardService.totalBooks$.subscribe(total => {
      this.totalBooks = total;
      console.log(this.totalBooks);

    });
    this.dashboardService.first10Books$.subscribe(books => {
      this.first_Books = books;
      console.log(this.first_Books);
    });
    this.dashboardService.totalOrder$.subscribe(total => {
      console.log('Total Orders Updated:', total);
      this.totalOrders = total;
    });
  

  }


  links = [
    { label: 'Dashboard', path: '/dashboard', icon: '🏠' },
    { label: 'Books', path: '/admin/books', icon: '📚' },
    { label: 'Authors', path: '/authors', icon: '✍️' },
    { label: 'Orders', path: '/orders', icon: '📦' },
    { label: 'Users', path: '/users', icon: '👥' },
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
