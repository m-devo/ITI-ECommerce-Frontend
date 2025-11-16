import { Routes } from '@angular/router';
import { MainLayout } from './core/layout/main-layout/main-layout';
import { Home } from './features/home/home';
import { AuthGuard } from './core/guards/auth.guard';
import { AdminGuard } from './core/guards/admin.guard';
import { LoginComponent } from './features/auth/login/login.component';
import { RegisterComponent } from './features/auth/register/register.component';
import { VerifyEmailComponent } from './features/auth/verify-email/verify-email.component';
import { VerifyDeviceComponent } from './features/auth/verify-device/verify-device.component';
import { ForgotPasswordComponent } from './features/auth/forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './features/auth/reset-password/reset-password.component';
import { GoogleCallbackComponent } from './features/auth/google-callback/google-callback.component';

export const routes: Routes = [
  // Main Layout (Ordinary User)
  {
    path: '',
    component: MainLayout,
    children: [
      {
        path: '',
        component: Home,
        pathMatch: 'full'
      },
      {
        path: 'shop',
        loadComponent: () => import('./features/shop/shop')
                              .then(m => m.Shop),
      },
      {
        path: 'user/complaints',
        loadComponent: () => import("./features/complaint/user/user-complaints/user-complaints")
                              .then(m => m.UserComplaints),
        canActivate: [AuthGuard]
      },
      {
        path: 'user/complaint/:id',
        loadComponent: () => import("./features/complaint/user/complaint-details/complaint-details")
                              .then(m => m.ComplaintDetails),
        canActivate: [AuthGuard]
      }
    ]
  },

  // Auth routes
  { path: 'auth/login', component: LoginComponent },
  { path: 'auth/register', component: RegisterComponent },
  { path: 'auth/verify/:token', component: VerifyEmailComponent },
  { path: 'auth/verify-device/:token', component: VerifyDeviceComponent },
  { path: 'auth/forgot-password', component: ForgotPasswordComponent },
  { path: 'auth/reset-password/:token', component: ResetPasswordComponent },
  { path: 'auth/google/callback', component: GoogleCallbackComponent },


  // Admin routes
  {
    path: 'admin',
    canActivate: [AuthGuard, AdminGuard],
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      {
        path: 'dashboard',
        loadComponent: () => import('./features/admin/dashboard/dashboard.component')
          .then(m => m.DashboardComponent),
      },
      {
        path: 'books',
        loadComponent: () => import('./features/admin/book-management/book-management.component')
          .then(m => m.BookManagementComponent)
      },
      {
        path: 'authors',
        loadComponent: () => import('./features/admin/authoradmin/authoradmin.component')
          .then(m => m.AuthoradminComponent)
      },
      {
        path: 'orders',
        loadComponent: () => import('./features/admin/orderadmin/orderadmin.component')
          .then(m => m.OrderadminComponent)
      },
      {
        path: 'users',
        loadComponent: () => import('./features/admin/useradmin/useradmin.component')
          .then(m => m.UseradminComponent)
      },

      {
        path: 'complaints',
        loadComponent: () => import('./features/complaint/admin/admin-complaints/admin-complaints')
                              .then(m => m.AdminComplaints),
      },
      {
        path: 'complaint/:id',
        loadComponent: () => import('./features/complaint/admin/admin-complaint-details/admin-complaint-details')
                              .then(m => m.AdminComplaintDetails),
      },
      {
        path: 'chat',
        loadComponent: () => import('./features/chatbot/admin-chatboard/admin-chatboard')
                              .then(m => m.AdminChatboard),
      }
    ]
  },

  // { path: '**', component: NotFound }
];
