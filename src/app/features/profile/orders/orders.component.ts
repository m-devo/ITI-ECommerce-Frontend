import { Component, OnInit } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatDividerModule } from '@angular/material/divider';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatTableModule } from '@angular/material/table';
import { MatBadgeModule } from '@angular/material/badge';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { UsersService } from '../../../core/services/users.service';
import { BookService } from '../../../core/services/book.service';
import { Order, OrderItem, Book } from '../../../core/models/api-models';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [
    CommonModule,
    CurrencyPipe,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatChipsModule,
    MatDividerModule,
    MatExpansionModule,
    MatTableModule,
    MatBadgeModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './orders.component.html',
  styleUrl: './orders.component.css'
})
export class OrdersComponent implements OnInit {
  orders: Order[] = [];
  isLoading = true;
  error: string | null = null;
  booksMap = new Map<string, Book>();

  displayedColumns: string[] = ['item', 'quantity', 'price', 'total'];

  constructor(private usersService: UsersService, private bookService: BookService) {}

  ngOnInit(): void {
    this.loadUserOrders();
  }

  private loadUserOrders(): void {
    this.usersService.getUserOrders().subscribe({
      next: (response) => {
        if (response.success && response.data) {
          this.orders = response.data.sort((a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
          // this.loadBookDetails();
          this.isLoading = false;
        } else {
          this.error = response.message || 'Failed to load orders';
          this.isLoading = false;
        }
      },
      error: (error) => {
        console.error('Error loading orders:', error);
        this.error = 'Failed to load orders data';
        this.isLoading = false;
      }
    });
  }

  // private loadBookDetails(): void {
  //   // Get all unique book IDs from orders
  //   const bookIds = new Set<string>();
  //   this.orders.forEach(order => {
  //     order.items.forEach(item => {
  //       if (item.bookId) {
  //         bookIds.add(item.bookId);
  //       }
  //     });
  //   });

  //   // If no book IDs, just set loading to false
  //   if (bookIds.size === 0) {
  //     this.isLoading = false;
  //     return;
  //   }

  //   // Load all books in parallel
  //   const bookRequests = Array.from(bookIds).map(bookId =>
  //     this.bookService.getBookById(bookId)
  //   );

  //   forkJoin(bookRequests).subscribe({
  //     next: (responses: any[]) => {
  //       responses.forEach(response => {
  //         if (response && response._id) {
  //           this.booksMap.set(response._id, response);
  //         }
  //       });
  //       this.isLoading = false;
  //     },
  //     error: (error) => {
  //       console.error('Error loading book details:', error);
  //       // Still show orders even if book details fail to load
  //       this.isLoading = false;
  //     }
  //   });
  // }

  getBookTitle(bookId: string): string {
    const book = this.booksMap.get(bookId);
    return book ? book.title : `Book ${bookId.slice(-8)}`;
  }

  getBookAuthor(bookId: string): string {
    const book = this.booksMap.get(bookId);
    return book ? book.author : 'Unknown Author';
  }

  getStatusIcon(status: string): string {
    switch (status) {
      case 'pending': return 'schedule';
      case 'paid': return 'payment';
      case 'completed': return 'check_circle';
      case 'cancelled': return 'cancel';
      case 'failed': return 'error';
      default: return 'help';
    }
  }

  getStatusColor(status: string): string {
    switch (status) {
      case 'pending': return 'warning';
      case 'paid': return 'primary';
      case 'completed': return 'success';
      case 'cancelled': return 'error';
      case 'failed': return 'error';
      default: return 'default';
    }
  }

  getPaymentMethodIcon(method: string): string {
    return method === 'cod' ? 'local_shipping' : 'credit_card';
  }

  getPaymentMethodLabel(method: string): string {
    return method === 'cod' ? 'Cash on Delivery' : 'Paymob';
  }

  formatDate(date: Date): string {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  calculateItemTotal(item: OrderItem): number {
    return item.quantity * item.price;
  }

  getTotalItems(order: Order): number {
    return order.items.reduce((total, item) => total + item.quantity, 0);
  }

  getOrdersByStatus(status: string): Order[] {
    return this.orders.filter(order => order.status === status);
  }

  getOrderBorderColor(status: string): string {
    switch (status) {
      case 'completed': return 'border-l-emerald-500';
      case 'pending': return 'border-l-amber-500';
      case 'paid': return 'border-l-blue-500';
      case 'cancelled': return 'border-l-red-500';
      default: return 'border-l-gray-500';
    }
  }

  getOrderStatusIconBg(status: string): string {
    switch (status) {
      case 'completed': return 'bg-emerald-100';
      case 'pending': return 'bg-amber-100';
      case 'paid': return 'bg-blue-100';
      case 'cancelled': return 'bg-red-100';
      default: return 'bg-gray-100';
    }
  }

  getOrderStatusChipClasses(orderStatus: string): string {
    switch (orderStatus) {
      case 'completed': return 'bg-green-100 text-green-800 text-sm font-medium px-2 py-1 rounded border border-green-200';
      case 'pending': return 'bg-yellow-100 text-yellow-800 text-sm font-medium px-2 py-1 rounded border border-yellow-200';
      case 'paid': return 'bg-blue-100 text-blue-800 text-sm font-medium px-2 py-1 rounded border border-blue-200';
      case 'cancelled': return 'bg-red-100 text-red-800 text-sm font-medium px-2 py-1 rounded border border-red-200';
      case 'failed': return 'bg-red-100 text-red-800 text-sm font-medium px-2 py-1 rounded border border-red-200';
      default: return 'bg-gray-100 text-gray-800 text-sm font-medium px-2 py-1 rounded border border-gray-200';
    }
  }

  refreshOrders(): void {
    this.loadUserOrders();
  }

  printOrder(order: Order): void {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    const orderHtml = `
      <html>
      <head>
        <title>Order Invoice #${order._id.slice(-8)}</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 20px; }
          h1 { color: #333; text-align: center; }
          .header { margin-bottom: 20px; }
          .header p { margin: 5px 0; }
          table { width: 100%; border-collapse: collapse; margin-top: 20px; }
          th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
          th { background-color: #f2f2f2; font-weight: bold; }
          .total { font-weight: bold; font-size: 18px; }
          .footer { margin-top: 20px; text-align: center; font-size: 12px; color: #666; }
        </style>
      </head>
      <body>
        <h1>Order Invoice</h1>
        <div class="header">
          <p><strong>Order ID:</strong> ${order._id}</p>
          <p><strong>Date:</strong> ${this.formatDate(order.createdAt)}</p>
          <p><strong>Status:</strong> ${order.status.charAt(0).toUpperCase() + order.status.slice(1)}</p>
          <p><strong>Payment Method:</strong> ${this.getPaymentMethodLabel(order.paymentMethod)}</p>
          <p><strong>Total Amount:</strong> $${order.totalPrice.toFixed(2)}</p>
        </div>
        <h2>Order Items</h2>
        <table>
          <thead>
            <tr>
              <th>Book Title</th>
              <th>Quantity</th>
              <th>Unit Price</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            ${order.items.map(item => `
              <tr>
                <td>${item.title}</td>
                <td>${item.quantity}</td>
                <td>$${item.price.toFixed(2)}</td>
                <td>$${this.calculateItemTotal(item).toFixed(2)}</td>
              </tr>
            `).join('')}
          </tbody>
          <tfoot>
            <tr>
              <td colspan="3" class="total">Grand Total:</td>
              <td class="total">$${order.totalPrice.toFixed(2)}</td>
            </tr>
          </tfoot>
        </table>
        <div class="footer">
          <p>Thank you for your business!</p>
        </div>
      </body>
      </html>
    `;

    printWindow.document.write(orderHtml);
    printWindow.document.close();
    printWindow.print();
  }
}
