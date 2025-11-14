import { Routes } from '@angular/router';
import { LoginComponent } from './features/auth/login/login.component';
import { RegisterComponent } from './features/auth/register/register.component';
import { VerifyEmailComponent } from './features/auth/verify-email/verify-email.component';
import { ForgotPasswordComponent } from './features/auth/forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './features/auth/reset-password/reset-password.component';
import { GoogleCallbackComponent } from './features/auth/google-callback/google-callback.component';
import { DashboardComponent } from './features/profile/dashboard/dashboard.component';

export const routes: Routes = [
  // Default route
  { path: '', redirectTo: '/auth/login', pathMatch: 'full' },

  // Auth routes
  { path: 'auth/login', component: LoginComponent },
  { path: 'auth/register', component: RegisterComponent },
  { path: 'auth/verify', component: VerifyEmailComponent },
  { path: 'auth/forgot-password', component: ForgotPasswordComponent },
  { path: 'auth/reset-password', component: ResetPasswordComponent },
  { path: 'auth/google/callback', component: GoogleCallbackComponent },

  // Protected routes (add auth guard later)
  { path: 'dashboard', component: DashboardComponent },

  // Catch all - redirect to login
  { path: '**', redirectTo: '/auth/login' },
];
