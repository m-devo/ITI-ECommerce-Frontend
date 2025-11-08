import { Routes } from '@angular/router';

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
];
