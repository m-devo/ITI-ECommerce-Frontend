import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AdminlayoutComponent } from '../adminlayout/adminlayout.component';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { OrdersService } from '../../../core/services/order.service';
import { DashboardService } from '../../../core/services/dasboard.service';

export interface Order {
  _id?: string;
  user: {
    _id: string;
    email?: string;
    role?: string;
  };
  items: {
    bookId: string;
    quantity: number;
    price: number;
  }[];
  billingData: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    country: string;
    state: string;
    city: string;
  };
  paymentMethod: string;
  totalPrice: number;
  totalItems: number;
  status?: "pending" | "paid" | "cancelled" | "completed";
  paymentTransactionId?: string | null;
  createdAt?: string;
  updatedAt?: string;
}


@Component({
  selector: 'app-orderadmin',
  standalone: true,
  imports: [CommonModule, RouterModule,
    AdminlayoutComponent, HttpClientModule, FormsModule],
  templateUrl: './orderadmin.component.html',
  styleUrl: './orderadmin.component.css'
})
export class OrderadminComponent {
  orders: any[] = [];
  currentPage = 1;
  limit = 10;
  pages: number[] = [];
  totalPages = 0;
  totalorders = 0;
  searchTerm: string = '';
  selectedOrder: Order | null = null;
  showModal: boolean = false;
  constructor(private orderService: OrdersService,private dashboardServices:DashboardService) { }
  ngOnInit() {
    this.fetchOrders();
  }
  generatePages() {
    this.pages = [];
    for (let i = 1; i <= this.totalPages; i++) {
      this.pages.push(i);
    }
  }

  goToPage(page: number) {
    this.currentPage = page;
    this.fetchOrders();
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.fetchOrders();
    }
  }

  previousPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.fetchOrders();
    }
  }

  fetchOrders() {
    this.orderService.getOrders(this.currentPage, this.limit).subscribe({
      next: (res: any) => {
        this.orders = res.data.orders;
        this.totalorders = res.data.totalOrders;
        this.totalPages = res.data.totalPages;
        this.generatePages();
        console.log(this.orders);
        console.log('totalOrders:', this.totalorders);
        this.dashboardServices.calculateOrders(this.totalorders);
      },
      error: (err) => console.error('Error fetching requests:', err)
    });
  }
  filteredOrders() {
    const term = this.searchTerm.toLowerCase();

    return this.orders.filter(order => {
      return (
        order.paymentMethod.toLowerCase().includes(term) ||
        order.totalPrice.toString().includes(term) ||
        order.totalItems.toString().includes(term) ||
        order.status.toLowerCase().includes(term)
      );
    });
  }
    editMode = false;
  editOrderData: any = {};
  selectedOrderId: string = "";
openEditModal(order: any) {
  this.selectedOrderId = order._id || '';
  this.editOrderData = {
    paymentMethod: order.paymentMethod || '',
    totalPrice: order.totalPrice || 0,
    totalItems: order.totalItems || 0,
    status: order.status || 'pending',  
    user: {
      email: order.user?.email || '',
      role: order.user?.role || ''
    }
  };

  this.editMode = true;
}

saveOrderEdits() {
  this.orderService.updateOrder(this.selectedOrderId, this.editOrderData).subscribe({
    next: (res) => {
      console.log("Order updated:", res);

      this.editMode = false;
      this.fetchOrders();
    },
    error: (err) => {
      console.error("Update error:", err);
    }
  });
}


}
