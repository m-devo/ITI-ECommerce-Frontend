import { Routes } from '@angular/router';
import { LoginComponent } from './features/auth/login/login.component';
import { RegisterComponent } from './features/auth/register/register.component';
import { VerifyEmailComponent } from './features/auth/verify-email/verify-email.component';
import { VerifyDeviceComponent } from './features/auth/verify-device/verify-device.component';
import { ForgotPasswordComponent } from './features/auth/forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './features/auth/reset-password/reset-password.component';
import { GoogleCallbackComponent } from './features/auth/google-callback/google-callback.component';
import { DashboardComponent } from './features/profile/dashboard/dashboard.component';
import { AdminGuard } from './core/guards/admin.guard';

export const routes: Routes = [

  // Auth routes
  { path: 'auth/login', component: LoginComponent },
  { path: 'auth/register', component: RegisterComponent },
  { path: 'auth/verify/:token', component: VerifyEmailComponent },
  { path: 'auth/verify-device/:token', component: VerifyDeviceComponent },
  { path: 'auth/forgot-password', component: ForgotPasswordComponent },
  { path: 'auth/reset-password/:token', component: ResetPasswordComponent },
  { path: 'auth/google/callback', component: GoogleCallbackComponent },

  { path: 'dashboard', component: DashboardComponent },


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
