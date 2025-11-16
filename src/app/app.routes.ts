import { Routes } from '@angular/router';
import { AuthGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'admin', pathMatch: 'full' },

  {
    path: 'admin',
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },

      // Dashboard
      {
        path: 'dashboard',
        loadComponent: () => import('./features/admin/dashboard/dashboard.component')
          .then(m => m.DashboardComponent)
      },

      // Books
      {
        path: 'books',
        loadComponent: () => import('./features/admin/book-management/book-management.component')
          .then(m => m.BookManagementComponent)
      },

      // Authors
      {
        path: 'authors',
        loadComponent: () => import('./features/admin/authoradmin/authoradmin.component')
          .then(m => m.AuthoradminComponent)
      },

      // Orders
      {
        path: 'orders',
        loadComponent: () => import('./features/admin/orderadmin/orderadmin.component')
          .then(m => m.OrderadminComponent)
      },

      // Users
      {
        path: 'users',
        loadComponent: () => import('./features/admin/useradmin/useradmin.component')
          .then(m => m.UseradminComponent)
      }
    ],
  },
// cart
{
  path: 'cart',  canActivate: [AuthGuard],
  loadComponent: () => import('./features/cart/cart-page/cart-page.component')
    .then(m => m.CartPageComponent)
},

// checkout
{
  path: 'checkout',  canActivate: [AuthGuard],
  loadComponent: () => import('./features/cart/checkout/checkout.component')
    .then(m => m.CheckoutComponent)
},

// user profile
{
  path: 'user', canActivate: [AuthGuard],
  loadComponent: () => import('./features/profile/dashboard/dashboard.component')
    .then(m => m.DashboardComponent),
      children: [
        { path: '', redirectTo: 'profile', pathMatch: 'full' },
        {
          path: 'profile',
          loadComponent: () => import('./features/profile/profile/profile.component')
            .then(m => m.ProfileComponent)
        },
        {
          path: 'orders',
          loadComponent: () => import('./features/profile/orders/orders.component')
            .then(m => m.OrdersComponent)
        },
        {
          path: 'books',
          loadComponent: () => import('./features/profile/books/books.component')
            .then(m => m.BooksComponent)
        }
      ]
  }
];
